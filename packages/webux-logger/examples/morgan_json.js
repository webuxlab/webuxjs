import express from 'express';
import bodyParser from 'body-parser';
import WebuxLogger from '../src/index.js';

const app = express();

const options = {
  type: 'json', // combined, tiny, dev, common, short, json
  tokens: null,
  format: {
    method: ':method',
    url: ':url',
    status: ':status',
    body: ':body',
    params: ':params',
    query: ':query',
    headers: ':headers',
    'http-version': ':http-version',
    'remote-ip': ':remote-addr',
    'remote-user': ':remote-user',
    length: ':res[content-length]',
    referrer: ':referrer',
    'user-agent': ':user-agent',
    'accept-language': ':language',
    'response-time': ':response-time ms',
  },
};

const webuxLogger = new WebuxLogger(options, console);

app.use(webuxLogger.OnRequest());

webuxLogger.log.info('webux-logging loaded !');

app.use(
  bodyParser.json({
    limit: '10MB',
  }),
);

app.get('/wait', (req, res) => {
  setTimeout(() => {
    res.status(200).json({ message: 'it took 1.5 seconds ...' });
  }, 1500);
});

app.use('*', (req, res) => {
  res.send('BONJOUR !');
});

app.listen(1337, () => {
  webuxLogger.log.info('Server is listening on port 1337');
});
