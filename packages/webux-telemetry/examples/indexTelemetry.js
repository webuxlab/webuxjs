// eslint-disable-next-line import/no-extraneous-dependencies
import { tracing_v2, Telemetry } from '../src/index.js';
tracing_v2();
import express from 'express';
import axios from 'axios';

const telemetry = new Telemetry({ telemetryEndpoint: 'http://localhost:3002/telemetry' });

const app = express();
const port = 3011;

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// curl http://localhost:3011/telemetry
app.all('/telemetry', async (req, res) => {
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
