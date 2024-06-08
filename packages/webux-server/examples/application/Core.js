import express from 'express';
import WebuxServer from '../../src/index.js';
import packageJson from './package.json' assert { type: 'json' };

const app = express();

export default function Core() {
  this.config = {
    ssl: {
      enabled: !!(process.env.KEY && process.env.CERT),
      key: process.env.KEY || '',
      cert: process.env.CERT || '',
    },
    enterprise: 'Studio Webux',
    author: 'Tommy Gingras',
    project: '@studiowebux/bin',
    version: packageJson.version,
    endpoint: '/api/v1',
    port: process.env.PORT || 1337,
    cores: 4,
  };

  this.express = express;
  this.app = app;
  this.log = console;

  this.server = new WebuxServer(this.config, this.app, this.log);
}
