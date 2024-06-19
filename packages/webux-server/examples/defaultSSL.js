import 'dotenv/config';

import express from 'express';
import WebuxServer from '../src/index.js';
import packageJson from '../package.json' assert { type: 'json' };

const options = {
  ssl: {
    enabled: true,
    cert: process.env.CERT,
    key: process.env.KEY,
  },
  enterprise: 'Studio Webux',
  author: 'Tommy Gingras',
  project: '@studiowebux/bin',
  version: packageJson.version,
  endpoint: '/api/v1',
  port: process.env.PORT || 1337,
  cores: 4, // If removed, it will automatically use all available cores.
};

const app = express();
const webuxServer = new WebuxServer(options, app, console);

app.set('node_env', process.env.NODE_ENV || 'development');
app.set('port', process.env.PORT || 1337);

app.get('/', (req, res) =>
  res.send({
    msg: 'Bonjour !',
    env: app.get('node_env'),
    port: app.get('port'),
    pid: process.pid,
  }),
);

webuxServer.StartServer();
