const options = {
  application_id: 'Test01',
  forceConsole: false,
  consoleLevel: 'silly',
  logstash: {
    host: '127.0.0.1',
    port: '5000', // udp only !
  },
  filenames: {
    error: 'log/error.log',
    warn: 'log/warn.log',
    info: 'log/info.log',
    verbose: 'log/verbose.log',
    debug: 'log/debug.log',
    silly: 'log/silly.log',
  },
  deniedKeys: ['password', 'authorization', 'accessToken', 'refreshToken'],
};

const Webuxlogger = require('../../src/index');

// const levels = {
//   error: 0,
//   warn: 1,
//   info: 2,
//   verbose: 3,
//   debug: 4,
//   silly: 5
// };

const webuxLog = new Webuxlogger(options);

const logger = webuxLog.CreateLogger();

logger.error('\x1b[33mAn error occured\x1b[0m');

logger.error('An error occured');
logger.info('An info occured');
logger.debug('A debug occured');
logger.warn({
  message: 'this is a json !',
  success: false,
  status: 500,
});
logger.silly('A silly message');
logger.verbose('A verbose message');

logger.info({
  body: {
    password: 'John',
    user: 'Doe',
    email: 'john@Doe.com',
    lastLogin: '2019-04-05',
  },
  message: 'bla bla bla',
  status: 201,
  success: true,
});

logger.info({
  message: "this message is required, Otherwise logstash won't take the entry",
  method: 'GET',
  url: '/sitemap.xml',
  headers: {
    authorization: 'bearert 1234456...',
    host: 'www.example.com',
    'user-agent':
      'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    accept: '*/*',
    'accept-encoding': 'gzip,deflate',
    from: 'googlebot(at)googlebot.com',
    'if-modified-since': 'Tue, 30 Sep 2019 11:34:56 GMT',
    'x-forwarded-for': '1.2.3.4',
  },
  body: {
    password: 'test123',
    user: {
      password: '123Test',
    },
    fullname: 'Hey !',
  },
});
