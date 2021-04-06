/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const path = require('path');

// Include the middlewares somehow...
const isAuthenticated = () => (req, res, next) => {
  console.log('The user must be authenticated to do this...');
  return next();
};

module.exports = {
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
            middlewares: [isAuthenticated()],
            action: require(path.join(__dirname, 'actions', 'user', 'find'))
              .route,
          },
          {
            method: 'post',
            middlewares: [],
            action: require(path.join(__dirname, 'actions', 'user', 'create'))
              .route,
          },
        ],
        '/:id': [
          {
            method: 'get',
            middlewares: [isAuthenticated()],
            action: require(path.join(__dirname, 'actions', 'user', 'findOne'))
              .route,
          },
          {
            method: 'put',
            middlewares: [isAuthenticated()],
            action: require(path.join(__dirname, 'actions', 'user', 'update'))
              .route,
          },
          {
            method: 'delete',
            middlewares: [isAuthenticated()],
            action: require(path.join(__dirname, 'actions', 'user', 'remove'))
              .route,
          },
        ],
      },
    },
  },
  resources: [
    {
      path: '/public',
      resource: path.join(__dirname, 'public'),
    },
    {
      path: '/img',
      resource: path.join(__dirname, 'images'),
    },
  ],
};
