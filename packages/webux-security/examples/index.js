/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const Joi = require('@hapi/joi');
const WebuxSecurity = require('../src/index');

const app = express();
const options = require('./options');

const Create = Joi.object()
  .keys({
    user: {
      username: Joi.string().required(),
      premium: Joi.boolean().required(),
    },
  })
  .required();

const Update = Joi.object({
  user: {
    premium: Joi.boolean().required(),
  },
}).required();

const ID = Joi.string()
  .pattern(/^[0-9]*$/)
  .required();

const Something = Joi.object({
  items: Joi.array().required(),
}).required();

async function loadApp() {
  const Security = new WebuxSecurity(options, console);

  Security.SetResponseHeader(app);
  Security.SetBodyParser(app);
  Security.SetCookieParser(app);
  Security.SetCors(app);
  Security.SetGlobal(app);
  Security.CreateRateLimiters(app);

  app.get('/', (req, res) => {
    console.info('Hello World !');
    return res.status(200).json({ msg: 'Bonjour !' });
  });

  // http://localhost:1337/account?limit=5&sort=-username&skip=100
  app.get('/account', WebuxSecurity.QueryParser(['password'], 'username premium'), (req, res) => {
    console.log(req.query);
    res.status(200).json({ query: req.query });
  });

  app.post('/something', (req, res) => {
    Security.validators
      .Custom(Something, req.body)
      .then((value) => {
        res.status(200).json({ msg: 'Bonjour !', value });
      })
      .catch((err) => {
        console.error(err);
        return res.status(400).json({ msg: 'BAD_REQUEST', reason: err.message });
      });
  });

  app.post('/account/:id', Security.validators.Id(ID), Security.validators.Body(Update), (req, res) => {
    console.info('Hello World !');
    return res.status(200).json({ msg: 'Bonjour !' });
  });

  app.post('/account', Security.validators.Body(Create), (req, res) => {
    console.info('Hello World !');
    return res.status(200).json({ msg: 'Bonjour !' });
  });

  app.post('/', (req, res) => {
    console.info('Hello World !');
    console.log(req.cookies);
    return res.status(200).json({ msg: 'Bonjour !' });
  });

  app.use('*', (error, req, res, next) => {
    console.error(error);
    res.status(error.code || 500).json(error || 'An error occured');
  });

  app.listen(1337, () => {
    console.log('Server listening on port 1337');
  });
}

try {
  loadApp();
} catch (e) {
  console.error(e);
  process.exit(1);
}
