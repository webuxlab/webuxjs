import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { jest } from '@jest/globals';
import express from 'express';
import WebuxRoute from '../src/index.js';
import { route as create } from '../examples/actions/user/create.js';
import { route as find } from '../examples/actions/user/find.js';
import { route as findOne } from '../examples/actions/user/findOne.js';
import { route as remove } from '../examples/actions/user/remove.js';
import { route as update } from '../examples/actions/user/update.js';

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('Create webuxRoute instance without options', () => {
  const Route = new WebuxRoute();

  expect(Route).toMatchObject({
    config: {},
    log: console,
  });
});

test('Create WebuxRoute instance with default options', () => {
  const opts = {
    routes: {
      '/': {
        resources: {
          '/': [
            // By default, this route is publicly available,
            // you should create a middleware to protect this resource.
            {
              method: 'get',
              middlewares: [],
              action: (req, res) =>
                res.success({
                  msg: 'Welcome ! The Documentation is available here : /api/',
                }),
            },
          ],
          '/healthcheck': [
            // By default, this route is publicly available,
            // you should create a middleware to protect this resource.
            {
              method: 'get',
              middlewares: [],
              action: (req, res) => res.success({ msg: 'Pong !' }),
            },
          ],
        },
      },
    },
    resources: [
      {
        path: '/public',
        resource: path.join(__dirname, '..', 'examples', 'public'),
      },
      {
        path: '/img',
        resource: path.join(__dirname, '..', 'examples', 'images'),
      },
    ],
  };

  const Route = new WebuxRoute(opts);

  expect(Route).toMatchObject({
    config: opts,
    log: console,
  });
});

test('Create WebuxRoute instance with some routes', () => {
  const opts = {
    routes: {
      '/': {
        resources: {
          '/': [
            // By default, this route is publicly available,
            // you should create a middleware to protect this resource.
            {
              method: 'get',
              middlewares: [],
              action: (req, res) =>
                res.success({
                  msg: 'Welcome ! The Documentation is available here : /api/',
                }),
            },
          ],
          '/healthcheck': [
            // By default, this route is publicly available,
            // you should create a middleware to protect this resource.
            {
              method: 'get',
              middlewares: [],
              action: (req, res) => res.success({ msg: 'Pong !' }),
            },
          ],
        },
      },
      '/user': {
        resources: {
          '/': [
            {
              method: 'get',
              middlewares: [],
              action: find,
            },
            {
              method: 'post',
              middlewares: [],
              action: create,
            },
          ],
          '/:id': [
            {
              method: 'get',
              middlewares: [],
              action: findOne,
            },
            {
              method: 'put',
              middlewares: [],
              action: update,
            },
            {
              method: 'delete',
              middlewares: [],
              action: remove,
            },
          ],
        },
      },
    },
    resources: [
      {
        path: '/public',
        resource: path.join(__dirname, '..', 'examples', 'public'),
      },
      {
        path: '/img',
        resource: path.join(__dirname, '..', 'examples', 'images'),
      },
    ],
  };

  const Route = new WebuxRoute(opts);

  expect(Route).toMatchObject({ config: opts, log: console });
});

test('LoadResponse', () => {
  const Route = new WebuxRoute();
  const app = express();

  const check = jest.fn(() => {
    Route.LoadResponse(app);
    return true;
  });

  check();

  expect(check).toHaveReturned();
});

test('LoadRoute', () => {
  const Route = new WebuxRoute();
  const router = express.Router();

  const opts = {
    routes: {
      '/': {
        resources: {
          '/': [
            // By default, this route is publicly available,
            // you should create a middleware to protect this resource.
            {
              method: 'get',
              middlewares: [],
              action: (req, res) =>
                res.success({
                  msg: 'Welcome ! The Documentation is available here : /api/',
                }),
            },
          ],
          '/healthcheck': [
            // By default, this route is publicly available,
            // you should create a middleware to protect this resource.
            {
              method: 'get',
              middlewares: [],
              action: (req, res) => res.success({ msg: 'Pong !' }),
            },
          ],
        },
      },
    },
  };

  const check = jest.fn(async () => {
    await Route.LoadRoute(router, opts.routes);
    return true;
  });

  check();

  expect(check).toHaveReturned();
});

test('LoadStatic', () => {
  const Route = new WebuxRoute();
  const app = express();
  const resources = [
    {
      path: '/public',
      resource: path.join(__dirname, '..', 'examples', 'public'),
    },
    {
      path: '/img',
      resource: path.join(__dirname, '..', 'examples', 'images'),
    },
  ];

  const check = jest.fn(async () => {
    await Route.LoadStatic(app, express, resources);
    return true;
  });

  check();

  expect(check).toHaveReturned();
});
