const express = require('express');
const path = require('path');
const app = express();
const { WebuxApp } = require('../src/index');

const options = {
  configuration: path.join(__dirname, 'config'),
};

const webuxApp = new WebuxApp(options);

webuxApp.LoadConfiguration();

const i18n = webuxApp.ConfigureLanguage();

app.use(webuxApp.I18nOnRequest());

app.get('/hello', (req, res) => {
  return res.status(200).send({
    msg: i18n.__('MSG_BONJOUR'),
    lang: i18n.getLocale(),
    from: webuxApp.GetIP(req),
  });
});

app.get('/error', (req, res, next) => {
  throw webuxApp.ErrorHandler(400, 'Bad Request', { test: 'An object to add extra information' }, 'Message for the dev. team');
});

app.use(webuxApp.NotFoundErrorHandler());
app.use(webuxApp.GlobalErrorHandler());

app.listen(1337, () => {
  console.log('Server is listening on port 1337');
});
