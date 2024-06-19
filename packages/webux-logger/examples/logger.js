import express from 'express';
import bodyParser from 'body-parser';
import WebuxLog from '../src/index.js';

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
    traceId: () => Math.round(Math.random() * 10000),
    spanId: () => Math.round(Math.random() * 10000),
    traceFlags: () => Math.round(Math.random() * 10000),
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

app.use((req, res, next) => {
  res.set('traceId', '__traceId__');
  res.set('spanId', '__spanId__');
  res.set('traceFlags', '__traceFlags__');
  return next();
});

app.use(
  bodyParser.json({
    limit: '10MB',
  }),
);

app.get('/wait', (req, res) => {
  setTimeout(() => {
    res.send('it took 1.5 seconds ...');
  }, 1500);
});

app.use('*', (req, res) => {
  res.send('BONJOUR !');
});

app.listen(1337, () => {
  webuxLogger.log.info('Server is listening on port 1337');
});
