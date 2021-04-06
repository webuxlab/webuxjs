/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const express = require('express');
const WebuxRoute = require('../src/index');

const app = express();

const resources = [
  {
    path: '/public',
    resource: path.join(__dirname, 'public'),
  },
  {
    path: '/img',
    resource: path.join(__dirname, 'images'),
  },
];

const webuxRoute = new WebuxRoute();
webuxRoute.LoadStatic(app, express, resources);

app.listen(1337, () => {
  console.log('Server is listening on port 1337');
});

// http://localhost:1337/public/
// http://localhost:1337/img/favicon.ico
