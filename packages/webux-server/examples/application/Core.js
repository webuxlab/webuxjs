/* eslint-disable global-require */
const express = require('express');
const WebuxServer = require('../../src/index');

const app = express();

function Core() {
  this.config = {
    ssl: {
      enabled: !!(process.env.KEY && process.env.CERT),
      key: process.env.KEY || '',
      cert: process.env.CERT || '',
    },
    enterprise: 'Studio Webux S.E.N.C',
    author: 'Tommy Gingras',
    project: '@studiowebux/bin',
    version: require('./package.json').version,
    endpoint: '/api/v1',
    port: process.env.PORT || 1337,
    cores: 4,
  };

  this.express = express;
  this.app = app;
  this.log = console;

  this.server = new WebuxServer(this.config, this.app, this.log);
}

module.exports = Core;
