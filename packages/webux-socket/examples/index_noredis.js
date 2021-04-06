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

  webuxSocket.Start();

  console.log('|-| Socket loaded !');

  server.listen(4444, () => {
    console.log('|-| Server is listening on port 4444');
  });
}

try {
  LoadApp();
} catch (e) {
  console.error(e);
  process.exit(2);
}
