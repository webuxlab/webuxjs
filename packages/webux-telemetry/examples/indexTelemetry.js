// eslint-disable-next-line import/no-extraneous-dependencies
require('../src/tracing').tracing('service-telemetry', require('../package.json').version);
const express = require('express');
const axios = require('axios').default;
const { middlewareTracing } = require('../src/tracing');
const { Telemetry } = require('../src/index');

const telemetry = new Telemetry({ telemetryEndpoint: 'http://localhost:3002/telemetry' });

const app = express();
const port = 3000;

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.all('/telemetry', middlewareTracing, async (req, res) => {
  telemetry.StartTimer();
  telemetry.RetrieveSystemInformation();
  telemetry.LogAction('fetch random product', true);
  const response = await axios.get(`https://dummyjson.com/products/${Math.floor(Math.random() * 101)}`);
  telemetry.LogAction('Random product fetched');

  telemetry.LogAction('fetch hi', true);
  const hi = await axios.get(`http://localhost:3001/hi`);
  telemetry.LogAction('hi fetched');

  telemetry.LogAction('fetch unstable', true);
  const unstable = await axios.get(`http://localhost:3001/unstable`).catch((e) => console.error(e.message));
  telemetry.LogAction('unstable fetched');

  telemetry.LogAction('fetch waitforit', true);
  const waitforit = await axios.get(`http://localhost:3001/waitforit`).catch((e) => console.error(e.message));
  telemetry.LogAction('waitforit fetched');

  telemetry.StopTimer();
  await telemetry.SendTelemetry();
  res.json({
    statusCode: 200,
    body: JSON.stringify({
      message: 'Data successfully saved !',
      data: req.body,
      response: response.data,
      hi: hi.data,
      waitforit: waitforit?.data || {},
      unstable: unstable?.data || {},
    }),
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
