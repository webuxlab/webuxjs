const express = require('express');
const axios = require('axios');
const WebuxRoute = require('../src/index');
const Webux = require('../../webux-app/src/index');
const WebuxSecurity = require('../../webux-security/src/index');

const webuxRoute = new WebuxRoute();
const webuxSecurity = new WebuxSecurity({
  bodyParser: {
    limit: '1mb',
    extended: false,
  },
});
const app = express();
const router = express.Router();

webuxSecurity.SetBodyParser(app);

// This function is an example to implement a request limit
// And stop the process correctly to avoid long running or hanged processes
async function waitForIt(data, signal) {
  return new Promise(async (resolve, reject) => {
    let id = null;
    try {
      signal.addEventListener('abort', () => {
        clearInterval(id);
        reject(new Error('Promise aborted due to request timeout.'));
      });

      Webux.log.debug(data.body, data.body1);
      id = setInterval(() => {
        console.debug(new Date());
      }, 500);

      const response = await axios.get('http://localhost:1337/itself', {
        signal,
      });

      resolve(response.data);
    } catch (e) {
      console.error(e.message);
      reject(e);
    } finally {
      clearInterval(id);
    }
  });
}

const routes = {
  '/': {
    resources: {
      '/itself': [
        {
          method: 'get',
          middlewares: [],
          action: async (req, res) => {
            const rnd = Math.floor(Math.random() * (10000 - 100) + 100);
            console.debug(rnd);
            setTimeout(() => {
              res.success({
                msg: 'Welcome ! The Documentation is available here : /api/',
              });
            }, rnd);
          },
        },
      ],
      '/': [
        {
          method: 'get',
          middlewares: [webuxRoute.ResetAbortController(), webuxRoute.RequestTimeout(5000, Webux.ErrorHandler), webuxRoute.HaltOnTimedout],
          action: async (req, res) => {
            try {
              const response = await waitForIt({ body: req.body }, res.locals.controller.signal);
              res.success({
                response,
              });
            } catch (e) {
              Webux.log.error(e.message);
            }
          },
        },
        {
          method: 'post',
          middlewares: [],
          action: (req, res) =>
            setTimeout(() => {
              res.success({
                msg: 'Welcome ! The Documentation is available here : /api/',
              });
            }, 5321),
        },
        {
          method: 'put',
          middlewares: [],
          action: (req, res) => {
            res.success({
              msg: 'Welcome ! The Documentation is available here : /api/',
            });
          },
        },
      ],
    },
  },
};

webuxRoute.LoadResponse(app);
webuxRoute.LoadRoute(router, routes);

app.use('/', router);

app.use(Webux.GlobalErrorHandler());

app.listen(1337, () => {
  console.log('Server is listening on port 1337');
});
