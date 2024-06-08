// node api_key.js
import express from 'express';
import WebuxSecurity from '../src/index.js';
import options from './options.js';

const app = express();
const Security = new WebuxSecurity(options, console);

let CLIENT_MOCK = [
  {
    ...Security.ApiKey.create_api_key_client('DEMO', '', 42, 2),
  },
];

/**
 *
 * @param {Security} security
 * @returns
 *
 */
const apiKeyMiddleware = (security) => (req, _res, next) => {
  const api_key = req.headers['x-api-key'];
  if (!api_key) throw new Error('Missing api key');
  const clientIndex = CLIENT_MOCK.findIndex((client) => client.api_key === api_key);
  if (!CLIENT_MOCK[clientIndex]) throw new Error('Invalid api key');

  const updated_client = security.ApiKey.check_api_key(CLIENT_MOCK[clientIndex]);
  CLIENT_MOCK[clientIndex] = updated_client;
  next();
};

async function loadApp() {
  Security.SetResponseHeader(app);
  Security.SetBodyParser(app);
  Security.SetCookieParser(app);
  Security.SetCors(app);
  Security.SetGlobal(app);
  Security.CreateRateLimiters(app);

  app.get('/', apiKeyMiddleware(Security), (_req, res) => {
    return res.status(200).json({ message: 'Bonjour !', success: true });
  });

  app.get('/usage', (_req, res, _next) => {
    return res.status(200).json({ message: CLIENT_MOCK, success: true });
  });

  app.put('/usage/:daily_limit', (req, res, _next) => {
    CLIENT_MOCK[0].limit = Security.ApiKey.update_limit(req.params.daily_limit);
    return res.status(200).json({ message: CLIENT_MOCK, success: true });
  });

  app.use('*', (error, _req, res, _next) => {
    console.error(error.message);
    res.status(error.code || 500).json({ message: error.message || 'An error occured', success: false });
  });

  app.listen(1337, () => {
    console.log('Server listening on port 1337');
    console.log('Client information for local testing:', CLIENT_MOCK[0]);

    console.log('Usage:');
    console.log(`curl -H "X-Api-Key: ${CLIENT_MOCK[0].api_key}" http://localhost:1337/`);
    console.log(`curl http://localhost:1337/usage`);
    console.log(`curl -XPUT http://localhost:1337/usage/4`);
  });
}

try {
  loadApp();
} catch (e) {
  console.error(e);
  process.exit(1);
}
