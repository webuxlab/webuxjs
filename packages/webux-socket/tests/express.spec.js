const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const http = require('http');
const request = require('supertest');
const WebuxSocket = require('../src'); // @studiowebux/socket

/**
 * This function is used to authenticate the user using the socket.io.
 * The function also check if the access token is not blacklisted in Redis.
 * @param {string} accessToken
 * @return {Promise<Object>} an error or a user decoded from the jwt token.
 */
function isAuth(accessToken) {
  return new Promise((resolve, reject) => {
    jwt.verify(accessToken, 'HARDCODED_JWT_SECRET', (err, user) => {
      if (err || !user) {
        console.error(err || '** No user found...');
        return reject(err || new Error('No user found'));
      }

      console.debug('** Checking token...');

      /* You Can add more validatation steps here, for example confirm the validity of the token in an external database */
      console.debug('** Token valid !');
      return resolve(user);
    });
  });
}

test('Using the authentication and express', async () => {
  const app = express();
  const server = http.createServer(app);

  app.use(cors());

  app.use('/giveme', (req, res) => {
    const token = jwt.sign(
      { aString: 'SHuuut ! this is my payload' },
      'HARDCODED_JWT_SECRET',
    );

    res.status(200).json({
      accessToken: token,
    });
  });

  // loading the webux socket module
  const webuxSocket = new WebuxSocket({
    authentication: {
      namespaces: ['default'],
      accessTokenKey: 'accessToken', // The cookie key name
      isAuthenticated: isAuth,
    },
  }, server);

  webuxSocket.AddAuthentication();
  webuxSocket.Standalone();

  console.log('|-| Socket loaded !');

  const res = await request(server)
    .get('/giveme')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200);

  expect(res.statusCode).toEqual(200);
  expect(res.body.accessToken).toBeDefined();
});
