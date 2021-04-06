/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
const options = {
  enterprise: 'Studio Webux S.E.N.C',
  author: 'Tommy Gingras',
  project: '@studiowebux/bin',
  version: require('../package.json').version,
  endpoint: '/api/v1',
};

const express = require('express');
const WebuxServer = require('../src/index');

const app = express();
const webuxServer = new WebuxServer(options, app, console);

app.get('/', (req, res) => res.send({
  msg: 'Bonjour !',
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  pid: process.pid,
}));

webuxServer.StartServer();
