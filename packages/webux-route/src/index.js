/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2020-05-06
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

const response = require('./response/index');
const serveStatic = require('./static/index');
const createRoute = require('./route/index');

/**
 * @class Route
 */
class Route {
  /**
   * Initialize the route
   * @param {Object} opts
   * @param {Object} log Custom logger, by default: console
   * @returns {VoidFunction}
   */
  constructor(opts, log = console) {
    this.config = opts || {};
    this.log = log;
  }

  /**
   * Load routes based on the configuration
   * @param {Object} router Express Router function
   * @param {Object} routes The routes configuration
   * (if not provided, the one from config.routes is loaded)
   * @returns {Promise}
   */
  LoadRoute(router, routes = null) {
    return createRoute(routes || this.config.routes, router, this.log);
  }

  /**
   * Load the static resources based on the configuration
   * @param {Object} app Express application
   * @param {Object} express Express instance
   * @param {String} resources The resources array
   * (if not provided, the one from config.resources is loaded)
   * @returns {Promise}
   */
  LoadStatic(app, express, resources = null) {
    return serveStatic(
      resources || this.config.resources,
      app,
      express,
      this.log,
    );
  }

  /**
   * Attach custom responses to express
   * @param {Object} app Express application
   * @returns {VoidFunction}
   */
  // eslint-disable-next-line class-methods-use-this
  LoadResponse(app) {
    response(app);
  }
}

module.exports = Route;
