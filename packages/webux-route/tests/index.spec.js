/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const path = require('path');
const express = require('express');
const WebuxRoute = require('../src');

test('Create webuxRoute instance without options', () => {
  const Route = new WebuxRoute();

  expect(Route).toMatchObject({
    config: {}, log: console,
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
              action: (req, res) => res.success({
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
    config: opts, log: console,
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
              action: (req, res) => res.success({
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
              action: require(path.join(__dirname, '..', 'examples', 'actions', 'user', 'find'))
                .route,
            },
            {
              method: 'post',
              middlewares: [],
              action: require(path.join(__dirname, '..', 'examples', 'actions', 'user', 'create'))
                .route,
            },
          ],
          '/:id': [
            {
              method: 'get',
              middlewares: [],
              action: require(path.join(__dirname, '..', 'examples', 'actions', 'user', 'findOne'))
                .route,
            },
            {
              method: 'put',
              middlewares: [],
              action: require(path.join(__dirname, '..', 'examples', 'actions', 'user', 'update'))
                .route,
            },
            {
              method: 'delete',
              middlewares: [],
              action: require(path.join(__dirname, '..', 'examples', 'actions', 'user', 'remove'))
                .route,
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

  const check = jest.fn(() => { Route.LoadResponse(app); return true; });

  check();

  expect(check).toHaveReturned();
});

test('LoadRoute', () => {
  const Route = new WebuxRoute();
  const app = express();
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
              action: (req, res) => res.success({
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
    await Route.LoadRoute(app.router, opts.routes);
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
