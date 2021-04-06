/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
const options = {
  ssl: {
    enabled: false,
    key: '',
    cert: '',
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

// This is possible to use the nodeJS event
webuxServer.server.on('connection', (req, socket, head) => {
  console.log(req);
  console.log(socket);
  console.log(head);
});
