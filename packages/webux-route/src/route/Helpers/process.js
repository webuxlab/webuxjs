/**
 * File: process.js
 * Author: Tommy Gingras
 * Date: 2019-06-23
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

const { sanitizeURL, routeType } = require('./utils');

/**
 * Process each action in a top level/specific resource
 * @param {Object} action The resource object, containing the logic and the middlewares.
 * @param {String} actions Specific route
 * e.g / or /:id or /upload or /* (note, the /user is not part of it)
 * @param {String} route Top Level e.g /user
 * @param {Object} router The express router object, Mandatory
 * @param {Object} log A custom logger function, optional
 * @returns {Promise}
 */
function processAction(action, actions, route, router, log) {
  return new Promise((resolve) => {
    let URL = route + actions;
    URL = sanitizeURL(URL);
    routeType(router, action, URL);

    // Due to a bug with winston, the console.log will be printed correctly.
    // But not the winston message, it will appear 1-2 seconds later ...
    log.info(
      `\x1b[33mwebux-route - ${action.method.toLowerCase()} ${URL.toLowerCase()}\x1b[0m`,
    );

    return resolve();
  });
}

/**
 * for each actions present in a top level route.
 * @param {String} actions Array of specific route
 * e.g /user/ or /user/:id or /user/upload or /user/*
 * @param {String} route Top Level e.g /user
 * @param {Object} routes An array of routes, mandatory
 * @param {Object} router The express router object, Mandatory
 * @param {Object} log A custom logger function, optional
 * @returns {VoidFunction}
 */
async function processActions(actions, route, routes, router, log) {
  if (typeof routes[route].resources[actions] === 'object') {
    // eslint-disable-next-line no-restricted-syntax
    for (const action of routes[route].resources[actions]) {
      // eslint-disable-next-line no-await-in-loop
      await processAction(action, actions, route, router, log);
    }
  }
}

/**
 * for each top level resources,
 * @param {String} route Top Level e.g /user
 * @param {Object} routes An array of routes, mandatory
 * @param {Object} router The express router object, Mandatory
 * @param {Object} log A custom logger function, optional
 * @returns {VoidFunction}
 */
async function processResources(route, routes, router, log) {
  // eslint-disable-next-line no-restricted-syntax
  for (const actions of Object.keys(routes[route].resources)) {
    if (typeof routes[route].resources[actions] === 'object') {
      // eslint-disable-next-line no-await-in-loop
      await processActions(actions, route, routes, router, log);
    }
  }
}

/**
 * based on a array of routes definition, this function will create a express router configuration.
 * @param {Object} routes An array of routes, mandatory
 * @param {Object} router The express router object, Mandatory
 * @param {Object} log A custom logger function, optional
 * @returns {Promise}
 */
function processRoutes(routes, router, log) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const route of Object.keys(routes)) {
      if (typeof routes[route].resources === 'object') {
        // eslint-disable-next-line no-await-in-loop
        await processResources(route, routes, router, log).catch((e) => reject(e));
      }
    }
    return resolve();
  });
}

module.exports = {
  processRoutes,
};
