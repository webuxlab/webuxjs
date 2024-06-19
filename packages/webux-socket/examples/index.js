// Please run this command before,
// docker run --name redis -p 6379:6379 redis

import WebuxSocket from '../src/index.js'; // @studiowebux/socket
import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

app.use(cors());

const isAuthModule = await import(path.join(__dirname, '.', 'isAuth.js'));

const opts = {
  authentication: {
    namespaces: ['profile', 'default'],
    accessTokenKey: 'accessToken', // The cookie key name
    isAuthenticated: isAuthModule.default, // the function to check if the user if authenticated
  },
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || '6379',
    password: process.env.REDIS_PASSWORD || '',
  },
  recursionAllowed: false, // to allow the recursion within directory in the actions directories.
  namespaces: {
    default: [
      path.join(__dirname, 'actions', 'user'),
      path.join(__dirname, 'actions', 'message'),
      path.join(__dirname, 'actions', '_ReservedEvents'),
    ],
    profile: [
      path.join(__dirname, 'actions', 'profile'),
      path.join(__dirname, 'actions', 'profile', 'private', 'superPrivate'), // With the recursionAllowed set to 'false' you can specify specific path within a path
      path.join(__dirname, 'actions', 'profile', 'private'), // With the recursionAllowed set to 'false' you can specify specific path within a path
    ],
    general: [path.join(__dirname, 'actions', 'message', 'find.js')], // to attach a specific function
  },
};

// to give a jwt token for testing,

app.use('/giveme', (req, res, next) => {
  const token = jwt.sign({ aString: 'SHuuut ! this is my payload' }, 'HARDCODED_JWT_SECRET');

  res.status(200).json({
    accessToken: token,
  });
});

function LoadApp() {
  // loading the webux socket module
  const webuxSocket = new WebuxSocket(opts, server);

  webuxSocket.AddAuthentication();
  webuxSocket.AddRedis(); // by default it uses 127.0.0.1 (when not configured)
  webuxSocket.Start();

  console.log('|-| Socket loaded !');

  server.listen(1339, () => {
    console.log('|-| Server is listening on port 1339');
  });
}

try {
  LoadApp();
} catch (e) {
  console.error(e);
  process.exit(2);
}
