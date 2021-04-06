/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const WebuxRoute = require('../src/index');

const app = express();
const router = express.Router();
const options = require('./config');

const webuxRoute = new WebuxRoute(options, console);

(async () => {
  await webuxRoute.LoadResponse(app);
  await webuxRoute.LoadRoute(router);

  app.use('/', router);

  // must be run at the end.
  await webuxRoute.LoadStatic(app, express);

  app.listen(1337, () => {
    console.log('Server is listening on port 1337');
  });
})();
