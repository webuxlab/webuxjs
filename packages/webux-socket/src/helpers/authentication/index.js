/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2019-05-25
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

const cookie = require('cookie');

/**
 * To configure the authentication
 * @param {Function} checkAuth The function to check if the user is authenticated
 * @param {Object} config The configuration
 * @param {Object} log The custom logger if any, by default `console`
 * @return {Function<socket, next>} Returns a function(socket, next)
 */
function useAuthentication(checkAuth, config, log) {
  return async (socket, next) => {
    log.debug(`webux-Socket - [io.use] Getting the cookie for ${socket.id}`);
    const cookies = cookie.parse(String(socket.handshake.headers.cookie));

    if (!cookies || !cookies[config.authentication.accessTokenKey]) {
      log.debug(
        `webux-Socket - [io.use] Bad Cookie ${JSON.stringify(cookie)} for ${
          socket.id
        }`,
      );
      return next(new Error('Access Token Not Present or Malformed'));
    }

    const accessToken = cookies[config.authentication.accessTokenKey];

    log.debug(`The access token : ${accessToken}`);
    log.debug(
      `webux-Socket - [io.use] Cookie is present, starting the authentication for ${socket.id}...`,
    );

    // the socket instance and the access token value
    const user = await checkAuth(accessToken).catch((e) => {
      log.debug(
        `webux-socket - The authentication has failed for ${socket.id}.`,
      );
      log.debug(e);
      return next(new Error('The authentication has failed'));
    });

    if (!user) {
      log.debug(`webux-socket - The user ${socket.id} is not connected.`);
      return next(new Error('The authentication has failed'));
    }

    log.debug(`webux-Socket - The user ${socket.id} is authenticated.`);

    // eslint-disable-next-line no-param-reassign
    socket.user = user;

    return next();
  };
}

/**
 * Add io.use to handle the authentication using a function provided in the configuration
 * The authentication method provided can be a actual function or a valid path to the function.
 * The authentication can also be configured per namespaces.
 * @return {VoidFunction}
 */
function Authenticate() {
  let checkAuth = null;

  if (
    !this.config
    || !this.config.authentication
    || !this.config.authentication.namespaces
  ) {
    this.log.debug('webux-Socket - Unable to configure the authentication.');
    throw new Error('No Options provided to configure the authentication');
  }

  if (!this.config.authentication.isAuthenticated) {
    throw new Error('The authentication method is not defined');
  } else if (typeof this.config.authentication.isAuthenticated === 'function') {
    checkAuth = this.config.authentication.isAuthenticated;
  } else if (
    typeof this.config.authentication.isAuthenticated === 'string'
    && typeof require(this.config.authentication.isAuthenticated) === 'function'
  ) {
    checkAuth = require(this.config.authentication.isAuthenticated);
  } else {
    throw new Error('The authentication method must be a function or a path');
  }

  this.log.debug('webux-Socket - Creating the authentication handler');

  this.config.authentication.namespaces.forEach((nsp) => {
    this.log.debug(`webux-Socket - Using authentication on namespace '${nsp}'`);
    if (nsp === 'default') {
      this.io.use(useAuthentication(checkAuth, this.config, this.log));
    } else {
      this.io
        .of(`/${nsp}`)
        .use(useAuthentication(checkAuth, this.config, this.log));
    }
  });
}

module.exports = Authenticate;
