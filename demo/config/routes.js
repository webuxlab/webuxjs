const path = require('path');
const Webux = require('../app');
const { handleHome } = require('../api/v1/actions/home');

const { route: randomRoute } = require('../api/v1/actions/randomNumber');
const { Get: GetRandom } = require('../api/v1/validations/example');

/**
 *
 * @param {Webux} Webux
 * @returns
 */
module.exports = (Webux) => ({
  routes: {
    //
    // API/V1/ADMIN
    //
    '/api/v1/admin': {
      resources: {
        '/random': [
          {
            method: 'get',
            middlewares: [Webux.Security.validators.Body(GetRandom)],
            action: randomRoute,
          },
        ],
      },
    },

    //
    // API/V1
    //
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

    //
    // VIEWS
    //
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

  //
  // Static Resources (Public)
  //
  resources: [
    {
      path: '/public',
      resource: path.join(__dirname, '..', 'public'),
    },
  ],
});
