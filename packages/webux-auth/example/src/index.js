import express from 'express';
import cors from 'cors';

import { initView } from './view.js';

import authentication from './routes/authentication.js';
import unprotected from './routes/unprotected.js';
import authenticated from './routes/authenticated.js';
import kitty from './routes/kitty.js';

import auth from './auth.js';

const { EXPRESS_PORT, EXPRESS_HOSTNAME } = process.env;
const app = express();

(async () => {
  app.use(cors());

  app.set('trust proxy', 1);

  initView(app);

  auth.load_redis_store();
  app.use(auth.load_express_session());
  await auth.initialize_keycloak_issuer();
  auth.initialize_keycloak_client();
  auth.initialize_oidc_passport();
  app.use(auth.passport_session());

  app.use(authentication(auth.passport, auth.client));
  app.use(authenticated);
  app.use(unprotected);
  app.use(kitty);

  // Global Error Handling
  app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).send(error.message || "I don't know .. sorry");
  });

  app.listen(EXPRESS_PORT, EXPRESS_HOSTNAME, () => {
    console.log(`Backend started at ${EXPRESS_HOSTNAME}:${EXPRESS_PORT}`);
  });
})();
