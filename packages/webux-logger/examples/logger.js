/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const bodyParser = require('body-parser');
const WebuxLog = require('../src/index');

const app = express();

// Only to configure winston
const options = {
  type: 'short', // combined, tiny, dev, common, short, json
  tokens: null,
  format: null,
  application_id: 'Test01',
  forceConsole: false,
  consoleLevel: 'silly',
  logstash: {
    host: '127.0.0.1',
    port: '5000', // udp only !
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
