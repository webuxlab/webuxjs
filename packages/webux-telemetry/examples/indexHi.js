// eslint-disable-next-line import/no-extraneous-dependencies
require('../src/tracing').tracing('service-hi', require('../package.json').version);
const express = require('express');
const { middlewareTracing } = require('../src/tracing');
const { requestCounterMiddleware, metricsMiddleware } = require('../src/metrics');

function waitForIt() {
  return new Promise((resolve) => setTimeout(async () => resolve(), Math.random() * 10000));
}

const app = express();
const port = 3001;

app.use(requestCounterMiddleware('example-hi', 'service-hi', require('../package.json').version));
app.use(metricsMiddleware('example-hi', 'service-hi', require('../package.json').version));

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.all('/hi', middlewareTracing, async (req, res) =>
  res.json({
    statusCode: 200,
    body: JSON.stringify({ message: 'Bonjour !' }),
  }),
);

app.all('/unstable', middlewareTracing, async (req, res) => {
  const code = Math.round(Math.random()) ? 200 : 500;
  res.statusCode = code;
  res.json({
    statusCode: code,
    body: JSON.stringify({ message: 'Sometimes I fail...' }),
  });
});

app.all('/waitforit', middlewareTracing, async (req, res) => {
  await waitForIt();
  const code = Math.round(Math.random()) ? 200 : 500;
  res.statusCode = code;
  res.json({
    statusCode: code,
    body: JSON.stringify({ message: 'Sometimes I fail...' }),
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
