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
  cores: 4, // If removed, it will automatically use all available cores.
};

const express = require('express');
const WebuxServer = require('../src/index');

const app = express();
const webuxServer = new WebuxServer(options, app, console);

app.set('node_env', process.env.NODE_ENV || 'development');
app.set('port', process.env.PORT || 1337);

app.get('/kill', (req, res) => {
  // Kill the current worker
  console.log('Kill the worker !');
  webuxServer.cluster.worker.kill();

  return res.send({
    msg: 'Killed',
    env: app.get('node_env'),
    port: app.get('port'),
    pid: process.pid,
  });
});

app.get('/stop', (req, res) => {
  // stop the server
  console.log('Stop the server !');
  // It takes some time before closing the connection,
  // Here is why : https://nodejs.org/api/net.html#net_server_close_callback
  webuxServer.server.close();

  webuxServer.server.getConnections((err, count) => {
    if (err) {
      throw err;
    }
    return res.send({
      msg: 'Killed',
      env: app.get('node_env'),
      port: app.get('port'),
      pid: process.pid,
      connections: count,
    });
  });
});

app.get('/', (req, res) => res.send({
  msg: 'Bonjour !',
  env: app.get('node_env'),
  port: app.get('port'),
  pid: process.pid,
}));

webuxServer.StartCluster().then((instance) => {
  if (instance && !instance.isMaster) {
    // console.log(instance);
    // instance.close((err) => {
    //   console.error(err);
    // });
  }
});
