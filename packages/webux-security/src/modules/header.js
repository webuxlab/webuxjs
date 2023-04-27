/**
 * File: header.js
 * Author: Tommy Gingras
 * Date: 2018-07-05
 * License: All rights reserved Studio Webux 2015-Present
 */

/**
 * Configure the Response Header
 * @param {Object} options The configuration of the module, Mandatory
 * @param {Function} app The express application, Mandatory
 * @param {Object} log The log function, optional, by default console
 * @return {VoidFunction} Return nothing.
 */
module.exports = (options, app, log = console) => {
  log.info('\x1b[33mwebux-security - Set the response header\x1b[0m');
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Methods', options.allowedMethods);
    res.header('Access-Control-Allow-Headers', options.allowedHeaders);
    res.header('Access-Control-Allow-Credentials', options.allowedCredentials);
    return next();
  });
};
