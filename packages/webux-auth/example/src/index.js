import express from 'express';
import cors from 'cors';

import { initSession } from './session.js';
import { initPassport } from './passport.js';
import { initView } from './view.js';
import { client } from './keycloak.js';

import authentication from './routes/authentication.js';
import unprotected from './routes/unprotected.js';
import authenticated from './routes/authenticated.js';
import kitty from './routes/kitty.js';

const { EXPRESS_PORT, EXPRESS_HOSTNAME } = process.env;

const app = express();

app.use(cors());

app.set('trust proxy', 1);

initView(app);

initSession(app);
const { passport } = initPassport(app, client);

app.use(authentication(passport));
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
