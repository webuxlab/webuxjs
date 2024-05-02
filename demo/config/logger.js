module.exports = {
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
  application_id: 'JAVR_01',
  forceConsole: false,
  consoleLevel: 'silly', // error, warn, info, verbose, debug, silly
  logstash: {
    // host: '127.0.0.1',
    // port: '5000', // udp only !
  },
  filenames: {
    error: 'log/error.log',
    warn: 'log/warn.log',
    info: 'log/info.log',
    verbose: 'log/verbose.log',
    debug: 'log/debug.log',
    silly: 'log/silly.log',
  },
  blacklist: ['password', 'authorization', 'accessToken', 'refreshToken'],
};
