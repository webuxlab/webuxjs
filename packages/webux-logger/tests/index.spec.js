const WebuxLogger = require('../src');

test('Create logger without option', () => {
  const logger = new WebuxLogger();

  expect(logger).toMatchObject({
    config: {},
    log: console,
  });

  const log = logger.CreateLogger();

  expect(logger).toMatchObject({
    config: {},
    log,
  });
});

test('Create logger with json options', () => {
  const opts = {
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
  const logger = new WebuxLogger(opts);

  expect(logger).toMatchObject({
    config: opts,
    log: console,
  });

  const log = logger.CreateLogger();

  expect(logger).toMatchObject({
    config: opts,
    log,
  });
});

test('Create logger with dev options', () => {
  const opts = {
    type: 'dev', // combined, tiny, dev, common, short, json
  };
  const logger = new WebuxLogger(opts);

  expect(logger).toMatchObject({
    config: opts,
    log: console,
  });

  const log = logger.CreateLogger();

  expect(logger).toMatchObject({
    config: opts,
    log,
  });
});

test('Create logger with full options using JSON', () => {
  const opts = {
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
    application_id: 'Test01',
    forceConsole: false,
    consoleLevel: 'silly', // error, warn, info, verbose, debug, silly
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
    blacklist: ['password', 'authorization', 'accessToken', 'refreshToken'],

  };
  const logger = new WebuxLogger(opts);

  expect(logger).toMatchObject({
    config: opts,
    log: console,
  });

  const log = logger.CreateLogger();

  expect(logger).toMatchObject({
    config: opts,
    log,
  });
});

test('Create logger with full options using dev', () => {
  const opts = {
    type: 'dev', // combined, tiny, dev, common, short, json
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
    application_id: 'Test01',
    forceConsole: false,
    consoleLevel: 'silly', // error, warn, info, verbose, debug, silly
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
    blacklist: ['password', 'authorization', 'accessToken', 'refreshToken'],

  };
  const logger = new WebuxLogger(opts);

  expect(logger).toMatchObject({
    config: opts,
    log: console,
  });

  const log = logger.CreateLogger();

  expect(logger).toMatchObject({
    config: opts,
    log,
  });
});

test('Create logger with tokens using JSON', () => {
  const opts = {
    type: 'json', // combined, tiny, dev, common, short, json
    tokens: [
      {
        name: 'params',
        needStringify: true,
      },
      {
        name: 'query',
        needStringify: true,
      },
      {
        name: 'headers',
        needStringify: true,
      },
      {
        name: 'type',
        needStringify: false,
        value: 'content-type',
        parent: 'headers',
      },
      {
        name: 'language',
        needStringify: false,
        value: 'accept-language',
        parent: 'headers',
      }],

  };
  const logger = new WebuxLogger(opts);

  expect(logger).toMatchObject({
    config: opts,
    log: console,
  });

  const log = logger.CreateLogger();

  expect(logger).toMatchObject({
    config: opts,
    log,
  });
});
