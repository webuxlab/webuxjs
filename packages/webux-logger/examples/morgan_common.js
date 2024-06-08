import express from 'express';
import bodyParser from 'body-parser';
import WebuxLog from '../src/index.js';

const app = express();

// common type is default
// console output is default
const webuxLogger = new WebuxLog();

app.use(webuxLogger.OnRequest());

webuxLogger.log.info('webux-logging loaded !');

app.use(
  bodyParser.json({
    limit: '10MB',
  }),
);

app.get('/wait', (req, res) => {
  setTimeout(() => {
    res.send('it took 1.5 seconds ...');
  }, 1500);
});

app.use('*', (req, res) => {
  res.send('BONJOUR !');
});

app.listen(1338, () => {
  webuxLogger.log.info('Server is listening on port 1338');
});
