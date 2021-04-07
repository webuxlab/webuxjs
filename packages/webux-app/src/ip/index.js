/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2018-07-05
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

/**
 * Get the IP of the client in the req variable.
 * @param {Object} req The request variable, Mandatory
 * @return {String} The IP of the client.
 */
module.exports = (req) => {
  if (!req) {
    throw new Error('req parameter is required.');
  }
  return (
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null)
  );
};
