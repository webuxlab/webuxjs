// Please run this command before,
// docker run --name redis -p 6379:6379 redis

const WebuxSocket = require('../src/index'); // @studiowebux/socket
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const server = require('http').createServer(app);

app.use(cors());

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
  const webuxSocket = new WebuxSocket(null, server);

  // webuxSocket.AddAuthentication(); no options are defined, unable to configure the middlewaree
  // webuxSocket.AddRedis(); // no options define, unable to configure the adapter
  // webuxSocket.Start(); // no namespaces configure, nothing will happen

  // The standalone method allows to do whatever you need, it exposes the socket.IO directly

  // Using default namespace
  webuxSocket.Standalone().on('connection', (socket) => {
    console.debug(`webux-socket - Socket ${socket.id} connected.`);

    socket.on('disconnect', () => {
      console.debug(`webux-socket - Socket ${socket.id} disconnected.`);
    });

    socket.emit('userFound', [1, 2, 3, 4, 5]);
  });

  // Using namespace
  webuxSocket
    .Standalone()
    .of('/profile')
    .on('connection', (socket) => {
      console.debug(`webux-socket - Socket ${socket.id} connected.`);

      socket.on('disconnect', () => {
        console.debug(`webux-socket - Socket ${socket.id} disconnected.`);
      });

      socket.emit('profileFound', [5, 4, 3, 2, 1, 0]);
    });

  console.log('Socket loaded !');

  server.listen(1339, () => {
    console.log('Server is listening on port 1339');
  });
}

try {
  LoadApp();
} catch (e) {
  console.error(e);
  process.exit(2);
}
