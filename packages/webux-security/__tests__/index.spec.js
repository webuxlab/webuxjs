const express = require('express');
// const Joi = require('@hapi/joi');

const WebuxSecurity = require('../src');

test('Create security instance without options', () => {
  const Security = new WebuxSecurity();

  expect(Security).toMatchObject({
    config: {},
    validators: expect.any(Object),
    log: console,
  });
});

test('Set response header without options', () => {
  const app = express();
  const Security = new WebuxSecurity();

  function check() {
    Security.SetResponseHeader(app);
  }

  expect(check).toThrowError('Server configuration is required');
});

test('Set bodyParser without options', () => {
  const app = express();
  const Security = new WebuxSecurity();

  function check() {
    Security.SetBodyParser(app);
  }

  expect(check).toThrowError('Body parser configuration is required');
});

test('Set cookieParser without options', () => {
  const app = express();
  const Security = new WebuxSecurity();

  function check() {
    Security.SetCookieParser(app);
  }

  expect(check).toThrowError('Cookie parser configuration is required');
});

test('Set cors without options', () => {
  const app = express();
  const Security = new WebuxSecurity();

  function check() {
    Security.SetCors(app);
  }

  expect(check).toThrowError('Cors configuration is required');
});

test('Set global without options', () => {
  const app = express();
  const Security = new WebuxSecurity();

  const check = jest.fn(() => {
    Security.SetGlobal(app);
    return true;
  });

  check();

  expect(check).toHaveReturned();
});

test('Create rate limiters without options', () => {
  const app = express();
  const Security = new WebuxSecurity();

  function check() {
    Security.CreateRateLimiters(app);
  }

  expect(check).toThrowError('Rate limiters configuration is required');
});

test('Set response header with options', () => {
  const app = express();
  const opts = {
    server: {
      trustProxy: true,
      allowedMethods: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      allowedCredentials: false,
      allowedHeaders: 'Origin, X-Requested-with, Accept, Authorization, Content-Type, Accept-Language',
    },
  };
  const Security = new WebuxSecurity(opts);

  const check = jest.fn(() => {
    Security.SetResponseHeader(app);
    return true;
  });

  check();

  expect(check).toHaveReturned();
});

test('Set bodyParser with options', () => {
  const app = express();
  const opts = {
    bodyParser: {
      limit: '1mb',
      extended: false,
    },
  };
  const Security = new WebuxSecurity(opts);

  const check = jest.fn(() => {
    Security.SetBodyParser(app);
    return true;
  });

  check();

  expect(check).toHaveReturned();
});

test('Set cookieParser with options', () => {
  const app = express();
  const opts = {
    cookieParser: {
      secret: process.env.COOKIE_SECRET || 'CookieSecret',
    },
  };
  const Security = new WebuxSecurity(opts);

  const check = jest.fn(() => {
    Security.SetCookieParser(app);
    return true;
  });

  check();

  expect(check).toHaveReturned();
});

test('Set cors with options', () => {
  const app = express();
  const opts = {
    cors: {
      whitelist: ['https://webuxlab.com', 'http://127.0.0.1'], // or [] to disable cors
    },
  };
  const Security = new WebuxSecurity(opts);

  const check = jest.fn(() => {
    Security.SetCors(app);
    return true;
  });

  check();

  expect(check).toHaveReturned();
});

test('Set global with options', () => {
  const app = express();
  const opts = {
    bodyParser: {
      limit: '1mb',
      extended: false,
    },
    cookieParser: {
      secret: process.env.COOKIE_SECRET || 'CookieSecret',
    },
    cors: {
      whitelist: ['https://webuxlab.com', 'http://127.0.0.1'], // or [] to disable cors
    },
    server: {
      trustProxy: true,
      allowedMethods: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      allowedCredentials: false,
      allowedHeaders: 'Origin, X-Requested-with, Accept, Authorization, Content-Type, Accept-Language',
    },
    rateLimiters: [
      {
        name: 'Authentication',
        time: 3600, // blocked for 1 hour
        maxReq: 3, // after 3 tries
        pattern: '/auth', // The route prefix to apply this limiter
      },
      {
        name: 'Global',
        time: 60, // blocked for 1 minute
        maxReq: 5, // after 5 tries the requester will be blocked for 1 minute
        pattern: '', // It applies globally
      },
    ],
  };

  const Security = new WebuxSecurity(opts);

  const check = jest.fn(() => {
    Security.SetGlobal(app);
    return true;
  });

  check();

  expect(check).toHaveReturned();
});

test('Create rate limiters with options', () => {
  const app = express();
  const opts = {
    rateLimiters: [
      {
        name: 'Authentication',
        time: 3600, // blocked for 1 hour
        maxReq: 3, // after 3 tries
        pattern: '/auth', // The route prefix to apply this limiter
      },
      {
        name: 'Global',
        time: 60, // blocked for 1 minute
        maxReq: 5, // after 5 tries the requester will be blocked for 1 minute
        pattern: '', // It applies globally
      },
    ],
  };

  const Security = new WebuxSecurity(opts);

  const check = jest.fn(() => {
    Security.CreateRateLimiters(app);
    return true;
  });

  check();

  expect(check).toHaveReturned();
});

test('Query parser with blacklisted query', () => {
  WebuxSecurity.QueryParser(['password'], 'username premium')({ query: 'password eq 1' }, {}, (i) => {
    expect(i.message).toEqual('INVALID_REQUEST');
  });
});

test('Query parser with whitelisted query', () => {
  WebuxSecurity.QueryParser(['password'], 'username premium')({ query: 'username eq 1' }, {}, (i) => {
    expect(i).toBeUndefined();
  });
});

// need to fix the validator it doesnt return the expected error
// test('custom validator', () => {
//   const Security = new WebuxSecurity();

//   const Something = Joi.object({
//     items: Joi.array().required(),
//   }).required();

//   const body = {
//     notValid: 'testing',
//   };

//   // const check = jest.fn(() => { socket.Start(); return true; });

//   // check();

//   // expect(check).toHaveReturned();

//   const check = async () => {
//     await Security.validators
//       .Custom(Something, body);
//   };

//   console.log(check);

//   expect(check).toThrowError('ValidationError: "items" is required');
// });
