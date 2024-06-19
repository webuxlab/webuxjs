import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { route as create } from './actions/user/create.js';
import { route as find } from './actions/user/find.js';
import { route as findOne } from './actions/user/findOne.js';
import { route as remove } from './actions/user/remove.js';
import { route as update } from './actions/user/update.js';

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Include the middlewares somehow...
const isAuthenticated = () => (req, res, next) => {
  console.log('The user must be authenticated to do this...');
  return next();
};

export default {
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
            middlewares: [isAuthenticated()],
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
            middlewares: [isAuthenticated()],
            action: findOne,
          },
          {
            method: 'put',
            middlewares: [isAuthenticated()],
            action: update,
          },
          {
            method: 'delete',
            middlewares: [isAuthenticated()],
            action: remove,
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
