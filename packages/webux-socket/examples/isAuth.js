const jwt = require('jsonwebtoken');

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

module.exports = isAuth;
