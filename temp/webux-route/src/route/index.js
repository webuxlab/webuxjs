/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2019-06-23
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

const { processRoutes } = require('./Helpers/process');

/**
 * this function creates custom routes with parameters
 * @param {Object} routes The routes, the routes definition, mandatory
 * @param {Function} router The router, an express function, mandatory
 * @param {Object} log The log function, optional
 * @returns {Promise}
 */
const CreateRoutes = (routes, router, log = console) => new Promise((resolve) => {
  try {
    log.info('\x1b[33mwebux-route - Creating routes\x1b[0m');
    Promise.all([processRoutes(routes, router, log)])
      .catch((e) => {
        log.error(`\x1b[31mwebux-route - ${e}\x1b[0m`);
        process.exit(1);
      })
      .then(() => {
        log.info('\x1b[33mwebux-route - Finished creating routes\x1b[0m');
        return resolve();
      });
  } catch (e) {
    log.error(`\x1b[31mwebux-route - ${e.message}\x1b[0m`);
    throw e;
  }
});

module.exports = CreateRoutes;
