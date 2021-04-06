/* eslint-disable global-require */
const WebuxServer = require('../src/index');

const handler = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('Hello World From the server');
  res.end();
};
const options = {
  enterprise: 'Studio Webux S.E.N.C',
  author: 'Tommy Gingras',
  project: '@studiowebux/bin',
  version: require('../package.json').version,
  endpoint: '/api/v1',
  port: process.env.PORT || 1337,
};

const webuxServer = new WebuxServer(options, handler, console);

webuxServer.StartServer();
// OR
// webuxServer.StartCluster();
