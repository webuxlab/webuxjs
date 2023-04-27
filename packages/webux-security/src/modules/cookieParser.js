/**
 * File: cookieParser.js
 * Author: Tommy Gingras
 * Date: 2019-06-16
 * License: All rights reserved Studio Webux 2015-Present
 */

const cookieParser = require('cookie-parser');

/**
 * Initializes the cookie-parser
 * @param {Object} options The configuration of the module, Mandatory
 * @param {Function} app The express application, Mandatory
 * @param {Object} log The log function, optional, by default console
 * @return {VoidFunction} Return the cookieParser
 */
module.exports = (options, app, log = console) => {
  log.info('\x1b[33mwebux-security - Configuring cookie parser\x1b[0m');
  app.use(cookieParser(options.secret));
};
