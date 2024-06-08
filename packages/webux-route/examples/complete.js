/* eslint-disable import/no-extraneous-dependencies */
import express from 'express';
import WebuxRoute from '../src/index.js';
import options from './config.js';

const app = express();
const router = express.Router();

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
