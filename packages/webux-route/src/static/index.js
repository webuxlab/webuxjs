/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2019-10-13
 * License: All rights reserved Studio Webux 2015-Present
 */

import path from 'node:path';

/**
 * Load static resources
 * @param {Object} options The configuration to start the server, mandatory
 * @param {Function} app An express application, mandatory
 * @param {Function} express The express object, mandatory
 * @param {Function} log The log function, optional, by default console
 * @returns {Promise}
 */
export default (resources, app, express, log = console) =>
  new Promise((resolve, reject) => {
    resources.forEach((resource) => {
      log.info(`\x1b[33mwebux-static - Link ${resource.path} to ${resource.resource}\x1b[0m`);
      if (!path.isAbsolute(resource.resource)) {
        reject(new Error('The resource path must be absolute'));
        return;
      }
      app.use(resource.path, express.static(resource.resource));
    });

    resolve('Static resources loaded !');
  });
