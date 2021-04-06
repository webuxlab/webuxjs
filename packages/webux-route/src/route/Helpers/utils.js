/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/**
 * File: utils.js
 * Author: Tommy Gingras
 * Date: 2019-08-02
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

/**
 * this function sanitize the URL, currently its only remove the slashes
 * @param {String} url The url, mandatory
 * @returns {String} return the sanitized URL
 */
function sanitizeURL(url) {
  const u = url;
  if (u.match(/\/\/+/)) {
    return u.replace(/(\/)\/+/g, '$1'); // Remove duplicate slashes (/)
  }

  return u;
}

/**
 *
 * @param {Object} router The router object from express router.
 * @param {Object} action The route object containing the definition
 * @param {String} URL The URL to access the resource
 * @returns {Object} The route object
 */
function routeType(router, action, URL) {
  if (typeof action.action === 'string') {
    // This is the path to the action
    return router[action.method.toLowerCase()](
      URL.toLowerCase(),
      action.middlewares,
      require(action.action),
    );
  }
  if (typeof action.action === 'function') {
    // This is the action directly
    return router[action.method.toLowerCase()](
      URL.toLowerCase(),
      action.middlewares,
      action.action,
    );
  }

  throw new Error('The action must be a path or a function.');
}

module.exports = { sanitizeURL, routeType };
