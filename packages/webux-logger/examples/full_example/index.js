import express from 'express';
import bodyParser from 'body-parser';
import WebuxLog from '../../src/index.js';

function waitForIt() {
  return new Promise((resolve) => setTimeout(async () => resolve(), Math.random() * 10000));
}

const app = express();

// Only to configure winston
const options = {
  type: 'json', // combined, tiny, dev, common, short, json
  tokens: null,
  format: {
    'remote-address': ':remote-addr',
    time: ':date',
    method: ':method',
    url: ':url',
    'http-version': ':http-version',
    'status-code': ':status',
    'content-length': ':res[content-length]',
    referrer: ':referrer',
    'user-agent': ':user-agent',
    params: ':params',
    body: ':body',
    headers: ':headers',
    query: ':query',
  },
  application_id: 'Test01',
  forceConsole: false,
  consoleLevel: 'silly',
  meta: {
    traceId: tracing.getTraceId,
    spanId: tracing.getSpanId,
    traceFlags: tracing.getTraceFlags,
  },
  logstash: {
    host: '127.0.0.1',
    port: '50000',
    mode: 'tcp',
  },
  filenames: {
    error: 'log/error.log',
    warn: 'log/warn.log',
    info: 'log/info.log',
    verbose: 'log/verbose.log',
    debug: 'log/debug.log',
    silly: 'log/silly.log',
  },
  deniedKeys: ['password', 'authorization', 'accessToken', 'refreshToken'],
};

// common type is default
// console output is default
const webuxLogger = new WebuxLog(options);

webuxLogger.CreateLogger();
app.use(webuxLogger.OnRequest());

webuxLogger.log.info('webux-logging loaded !');

app.use(
  bodyParser.json({
    limit: '10MB',
  }),
);

app.all('/hi', async (req, res) =>
  res.json({
    statusCode: 200,
    body: JSON.stringify({ message: 'Bonjour !' }),
  }),
);

app.all('/unstable', async (req, res) => {
  const code = Math.round(Math.random()) ? 200 : 500;
  res.statusCode = code;
  res.json({
    statusCode: code,
    body: JSON.stringify({ message: 'Sometimes I fail...' }),
  });
});

app.all('/waitforit', async (req, res) => {
  await waitForIt();
  const code = Math.round(Math.random()) ? 200 : 500;
  res.statusCode = code;
  res.json({
    statusCode: code,
    body: JSON.stringify({ message: 'Sometimes I fail...' }),
  });
});

app.listen(1337, () => {
  webuxLogger.log.info('Server is listening on port 1337');
});
