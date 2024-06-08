import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Webux from '../app/index.js';
import { handleHome } from '../api/v1/actions/home/index.js';

import { route as randomRoute } from '../api/v1/actions/randomNumber/index.js';
import { Get as GetRandom } from '../api/v1/validations/example.js';

import { route as nameGeneratorRoute } from '../api/v1/actions/nameGenerator/index.js';

import { route as createApiKeyRoute } from '../api/v1/actions/create_api_key/index.js';
import { Post as PostApiKey } from '../api/v1/validations/api_key.js';

import { route as getUsageApiKeyRoute } from '../api/v1/actions/get_api_key_usage/index.js';

import api_key_middleware from '../api/v1/middlewares/api_key.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 *
 * @param {Webux} Webux
 * @returns
 */
export default (Webux) => ({
  routes: {
    //
    // API/V1/ADMIN
    //
    '/api/v1/admin': {
      resources: {
        '/random': [
          {
            method: 'post',
            middlewares: [Webux.Security.validators.Body(GetRandom)],
            action: randomRoute,
          },
        ],
        '/api_key': [
          {
            method: 'post',
            middlewares: [
              api_key_middleware(Webux.Security), // nah... this is a chicken and egg..
              Webux.Security.validators.Body(PostApiKey),
            ],
            action: createApiKeyRoute,
          },
        ],
        '/api_key/usage': [
          {
            method: 'get',
            middlewares: [],
            action: getUsageApiKeyRoute,
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
        '/generator/name': [
          {
            method: 'get',
            middlewares: [api_key_middleware(Webux.Security)],
            action: nameGeneratorRoute,
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
