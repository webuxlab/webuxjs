/**
 * File: components.js
 * Author: Tommy Gingras
 * Date: 2019-06-13
 * License: All rights reserved Studio Webux 2015-Present
 */

import helmet from 'helmet';
import compression from 'compression';

/**
 * Initialize all security modules.
 * @param {Object} options The configuration of the module, Mandatory
 * @param {Function} app The express application, Mandatory
 * @param {object} log The log function, optional, by default console
 * @return {VoidFunction} Return nothing.
 */
export default (options, app, log = console) => {
  log.info('\x1b[33mwebux-security - Initialize the security components\x1b[0m');
  app.use(compression());
  app.enable('trust proxy');
  app.set('trust proxy', options.trustProxy || false);
  app.use(helmet(options.helmet || undefined));
  app.disable('x-powered-by');
};
