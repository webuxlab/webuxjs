import express from 'express';
import path from 'node:path';
import { WebuxApp } from '../src/index.js';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const options = {
  configuration: path.join(__dirname, 'config'),
};

const webuxApp = new WebuxApp(options);

await webuxApp.LoadConfiguration();

const i18n = webuxApp.ConfigureLanguage();

app.use(webuxApp.I18nOnRequest());

app.get('/', (req, res) => {
  return res.status(200).send({
    msg: i18n.__('MSG_BONJOUR'),
    lang: i18n.getLocale(),
    from: webuxApp.GetIP(req),
  });
});

app.listen(1337, () => {
  console.log('Server is listening on port 1337');
});
