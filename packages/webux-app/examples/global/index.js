const { webuxApp } = require('./app');
const { app, ErrorHandler } = webuxApp;

app.use(webuxApp.I18nOnRequest());

app.get('/hello', (req, res) => {
  return res.status(200).send({
    msg: res.__('MSG_BONJOUR'),
    lang: webuxApp.i18n.getLocale(),
    from: webuxApp.GetIP(req),
  });
});

app.get('/error', (req, res) => {
  throw ErrorHandler(400, res.__('BAD_REQUEST'), { test: 'An object to add extra information' }, 'Message for the dev. team');
});

app.use(webuxApp.NotFoundErrorHandler());
app.use(webuxApp.GlobalErrorHandler());

app.listen(1337, () => {
  console.log('Server is listening on port 1337');
});
