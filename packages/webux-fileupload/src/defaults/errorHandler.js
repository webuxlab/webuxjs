/**
 * File: errorHandler.js
 * Author: Tommy Gingras
 * Date: 2020-06-02
 * License: All rights reserved Studio Webux 2015-Present
 */

/**
 * Default errorHandler function
 * @param {Number} code HTTP Code
 * @param {String} msg Error Message
 * @param {Object} extra An object to store extra information
 * @param {String} devMsg Message dedicated for developers
 * @returns {Error} An error
 */
module.exports = (code, msg, extra, devMsg) => {
  const error = new Error();

  error.code = code || 500;
  error.message = msg || '';
  error.extra = extra || {};
  error.devMessage = devMsg || '';

  return error;
};
