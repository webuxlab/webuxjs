import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import server from 'node:http';
import { jest } from '@jest/globals';
import WebuxSocket from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('Create new WebuxSocket instance without options', () => {
  const socket = new WebuxSocket();
  expect(socket).toMatchObject({
    config: undefined,
    io: null,
    log: console,
  });
});

test('Create new WebuxSocket instance with options', () => {
  const opts = {
    authentication: {
      namespaces: ['default'],
      accessTokenKey: 'accessToken', // The cookie key name
      isAuthenticated: path.join(__dirname, '.', 'isAuth.js'), // the function to check if the user if authenticated using a path
    },
    redis: {
      // it uses 127.0.0.1:6379 without password
    },
    recursionAllowed: true, // to allow the recursion within directory in the actions directories.
    ignoreFirstDirectory: true,
    namespaces: {
      default: [path.join(__dirname, 'actions')], // everything will be exported inside the default namespace '/'
    },
  };

  const socket = new WebuxSocket(opts);

  expect(socket).toMatchObject({
    config: opts,
    io: null,
    log: console,
  });
});

test('Create new WebuxSocket instance with options and an express server start the server', () => {
  const opts = {
    authentication: {
      namespaces: ['default'],
      accessTokenKey: 'accessToken', // The cookie key name
      isAuthenticated: path.join(__dirname, '.', 'isAuth.js'), // the function to check if the user if authenticated using a path
    },
    redis: {
      // it uses 127.0.0.1:6379 without password
    },
    recursionAllowed: true, // to allow the recursion within directory in the actions directories.
    ignoreFirstDirectory: true,
    namespaces: {
      default: [path.join(__dirname, 'actions')], // everything will be exported inside the default namespace '/'
    },
  };

  const app = express();
  const tmpServer = server.createServer(app);

  const socket = new WebuxSocket(opts, tmpServer);
  const check = jest.fn(() => {
    socket.Start();
    return true;
  });

  check();

  expect(check).toHaveReturned();
});

test('Create new WebuxSocket instance with options and an express server start the standalone instance', () => {
  const opts = {
    authentication: {
      namespaces: ['default'],
      accessTokenKey: 'accessToken', // The cookie key name
      isAuthenticated: path.join(__dirname, '.', 'isAuth.js'), // the function to check if the user if authenticated using a path
    },
    redis: {
      // it uses 127.0.0.1:6379 without password
    },
  };

  const app = express();
  const tmpServer = server.createServer(app);

  const socket = new WebuxSocket(opts, tmpServer);
  const check = jest.fn(() => {
    socket.Standalone();
    return true;
  });

  check();

  expect(check).toHaveReturned();
});

test('Create new WebuxSocket instance with no options and an express server start the standalone instance', () => {
  const app = express();
  const tmpServer = server.createServer(app);

  const socket = new WebuxSocket(null, tmpServer);
  const check = jest.fn(() => {
    socket.Standalone();
    return true;
  });

  check();

  expect(check).toHaveReturned();
});

test('Create new WebuxSocket instance with no options and an express server start the server', () => {
  const app = express();
  const tmpServer = server.createServer(app);

  const socket = new WebuxSocket(null, tmpServer);

  function fn() {
    socket.Start();
  }

  expect(fn).toThrowError('No Namespace defined');
});

test('Create new WebuxSocket instance with no options and no server start the server', () => {
  const socket = new WebuxSocket();

  function fn() {
    socket.Start();
  }

  expect(fn).toThrowError('Socket.IO not initialized');
});

test('Create new WebuxSocket instance with no options and no server, initialize without server', () => {
  const socket = new WebuxSocket();

  function fn() {
    socket.Initialize();
  }

  expect(fn).toThrowError('A server instance is required');
});

test('Create new WebuxSocket instance with no options and an express server, initialize without server', () => {
  const app = express();
  const tmpServer = server.createServer(app);

  const socket = new WebuxSocket(null, tmpServer);

  function fn() {
    socket.Initialize();
  }

  expect(fn).toThrowError('A server instance is required');
});

test('Create new WebuxSocket instance with no options and no server, initialize with a server', () => {
  const app = express();
  const tmpServer = server.createServer(app);

  const socket = new WebuxSocket();

  function fn() {
    const tSocket = socket.Initialize(tmpServer);
    return tSocket;
  }

  const s = fn();

  function start() {
    socket.Start();
    return true;
  }

  expect(s).toBeDefined();
  expect(start).toThrowError('No Namespace defined');
});

test('Create new WebuxSocket instance with no options, an express server, configure the authentication', () => {
  const opts = {
    authentication: {
      namespaces: ['default'],
      accessTokenKey: 'accessToken', // The cookie key name
      isAuthenticated: () => true,
    },
  };

  const app = express();
  const tmpServer = server.createServer(app);

  const socket = new WebuxSocket(opts, tmpServer);
  const check = jest.fn(() => {
    socket.AddAuthentication();
    return true;
  });

  check();

  expect(check).toHaveReturned();
});
