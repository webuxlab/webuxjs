const path = require('path');

module.exports = (Webux) => ({
  routes: {
    '/': {
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
  },
  resources: [
    {
      path: '/public',
      resource: path.join(__dirname, '..', 'public'),
    },
  ],
});
