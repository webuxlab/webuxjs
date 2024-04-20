const path = require('path');
const { handleHome } = require('../api/v1/actions/home');

module.exports = (Webux) => ({
  routes: {
    '/api/v1': {
      resources: {
        '/': [
          {
            method: 'get',
            middlewares: [], // By default, this route is publicly available, you should create a middleware to protect this resource.
            action: (req, res, next) =>
              res.success({
                msg: 'Welcome ! ',
              }),
          },
        ],
        '/healthcheck': [
          {
            method: 'get',
            middlewares: [], // By default, this route is publicly available, you should create a middleware to protect this resource.
            action: (req, res, next) => res.success({ msg: 'Pong !' }),
          },
        ],
      },
    },
    '/': {
      resources: {
        '/home': [
          {
            method: 'get',
            middlewares: [], // By default, this route is publicly available, you should create a middleware to protect this resource.
            action: (req, res, next) => {
              const { page, data } = handleHome();
              res.render(page, data);
            },
          },
        ],
      },
    },
  },
  resources: [
    {
      path: '/public',
      resource: path.join(__dirname, '..', 'public'),
    },
  ],
});
