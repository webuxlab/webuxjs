// eslint-disable-next-line import/no-extraneous-dependencies

import { metricsMiddleware, requestCounterMiddleware, tracing_v2 } from '../src/index.js';
tracing_v2();

import express from 'express';
import packageJson from '../package.json' assert { type: 'json' };

function waitForIt() {
  return new Promise((resolve) => setTimeout(async () => resolve(), Math.random() * 10000));
}

const app = express();
const port = 3001;

// /metrics
app.use(requestCounterMiddleware('example-hi', 'service-hi', packageJson.version));
app.use(metricsMiddleware('example-hi', 'service-hi', packageJson.version));

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// curl http://localhost:3001/hi
app.all('/hi', async (req, res) =>
  res.json({
    statusCode: 200,
    body: JSON.stringify({ message: 'Bonjour !' }),
  }),
);

// curl http://localhost:3001/unstable
app.all('/unstable', async (req, res) => {
  const code = Math.round(Math.random()) ? 200 : 500;
  res.statusCode = code;
  res.json({
    statusCode: code,
    body: JSON.stringify({ message: 'Sometimes I fail...' }),
  });
});

// curl http://localhost:3001/waitforit
app.all('/waitforit', async (req, res) => {
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
