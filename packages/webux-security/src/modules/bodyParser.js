/**
 * File: bodyParser.js
 * Author: Tommy Gingras
 * Date: 2019-05-25
 * License: All rights reserved Studio Webux 2015-Present
 */

import bodyParser from 'body-parser';

/**
 * Initialize the body-parser
 * json and urlencoded
 * @param {Object} options The configuration of the module, Mandatory
 * @param {Function} app The express application, Mandatory
 * @param {Object} log The log function, optional, by default console
 * @return {VoidFunction} Return nothing
 */
export default (options, app, log = console) => {
  log.info('\x1b[33mwebux-security - Configuring the body parser\x1b[0m');

  app.use(
    bodyParser.json({
      limit: options.limit || '1mb',
    }),
  );

  app.use(
    bodyParser.urlencoded({
      limit: options.limit || '1mb',
      extended: options.extended || false,
    }),
  );
};
