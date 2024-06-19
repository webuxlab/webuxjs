import express from 'express';
import WebuxServer from '../src/index.js';
import packageJson from '../package.json' assert { type: 'json' };

const options = {
  enterprise: 'Studio Webux',
  author: 'Tommy Gingras',
  project: '@studiowebux/bin',
  version: packageJson.version,
  endpoint: '/api/v1',
};

const app = express();
const webuxServer = new WebuxServer(options, app, console);

app.get('/', (req, res) =>
  res.send({
    msg: 'Bonjour !',
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    pid: process.pid,
  }),
);

webuxServer.StartServer();
