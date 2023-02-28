// eslint-disable-next-line import/no-extraneous-dependencies
require('../src/tracing').tracing("service-hi", require('../package.json').version);
const express = require('express');
const axios = require('axios').default;
const { middlewareTracing } = require('../src/tracing');

const app = express();
const port = 3001;

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.all('/hi', middlewareTracing, async (req, res) =>
  res.json({
    statusCode: 200,
    body: JSON.stringify({ message: 'Bonjour !' }),
  }),
);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
