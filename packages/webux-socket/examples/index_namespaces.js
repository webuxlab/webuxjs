// Please run this command before,
// docker run --name redis -p 6379:6379 redis

const WebuxSocket = require('../src/index'); // @studiowebux/socket
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();
const server = require('http').createServer(app);

app.use(cors());

const opts = {
  authentication: {
    namespaces: [],
    accessTokenKey: 'accessToken', // The cookie key name
    isAuthenticated: path.join(__dirname, '.', 'isAuth.js'), // the function to check if the user if authenticated using a path
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
      path.join(__dirname, 'actions', 'profile'),
    ],
    profile: [
      path.join(__dirname, 'actions', 'profile', 'private', 'superPrivate'), // With the recursionAllowed set to 'false' you can specify specific path within a path
      path.join(__dirname, 'actions', 'profile', 'private'), // With the recursionAllowed set to 'false' you can specify specific path within a path
    ],
    general: [path.join(__dirname, 'actions', 'message', 'find.js')], // to attach a specific function
  },
};

// to give a jwt token for testing,

app.use('/giveme', (req, res, next) => {
  const token = jwt.sign(
    { aString: 'SHuuut ! this is my payload' },
    'HARDCODED_JWT_SECRET',
  );

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
