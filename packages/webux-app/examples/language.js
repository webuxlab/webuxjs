import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebuxApp } from '../src/index.js';

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

// curl localhost:1337/
app.get('/', (req, res) => {
  console.log(webuxApp.i18n.getLocale());

  res.status(200).send({ msg: res.__('MSG_BONJOUR'), lang: i18n.getLocale() });
});

app.listen(1337, () => {
  console.log('Server is listening on port 1337');
});
