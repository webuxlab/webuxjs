/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
require('dotenv').config();

const options = {
  ssl: {
    enabled: true,
    cert: process.env.CERT,
    key: process.env.KEY,
  },
  enterprise: 'Studio Webux S.E.N.C',
  author: 'Tommy Gingras',
  project: '@studiowebux/bin',
  version: require('../package.json').version,
  endpoint: '/api/v1',
  port: process.env.PORT || 1337,
};

const express = require('express');
const WebuxServer = require('../src/index');

const app = express();
const webuxServer = new WebuxServer(options, app, console);

app.set('node_env', process.env.NODE_ENV || 'development');
app.set('port', process.env.PORT || 1337);

app.get('/', (req, res) => res.send({
  msg: 'Bonjour !',
  env: app.get('node_env'),
  port: app.get('port'),
  pid: process.pid,
}));

webuxServer.StartServer();
