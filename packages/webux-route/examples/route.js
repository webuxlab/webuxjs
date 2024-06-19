import express from 'express';
import WebuxRoute from '../src/index.js';
import { route as create } from './actions/user/create.js';
import { route as find } from './actions/user/find.js';
import { route as findOne } from './actions/user/findOne.js';
import { route as remove } from './actions/user/remove.js';
import { route as update } from './actions/user/update.js';

const app = express();
const router = express.Router();

const isAuthenticated = () => (req, res, next) => {
  console.log('The user must be authenticated to do this...');
  return next();
};

const routes = {
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
      '/config': [
        {
          method: 'get',
          middlewares: [],
          action: (req, res) => {
            // FIXME: THIS IS TOTALLY UNSECURE TO DO THAT !!!
            if (process.env.NODE_ENV === 'production') {
              return res.success('Route disabled in production');
            }
            return res.success({ config: WebuxRoute.config });
          },
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
};

const webuxRoute = new WebuxRoute();

webuxRoute.LoadResponse(app);
webuxRoute.LoadRoute(router, routes);

app.use('/', router);

app.listen(1337, () => {
  console.log('Server is listening on port 1337');
});
