/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2024-04-20
 * License: All rights reserved Studio Webux 2015-Present
 */

class View {
  /**
   * Initialize the application
   * @param {Object} opts
   * @param {Object} log Custom logger, by default: console
   * @returns {VoidFunction}
   */
  constructor(opts, log = console) {
    this.config = opts || {};
    this.log = log;
  }

  /**
   * Setup EJS
   * @param {Object} app ExpressJS Application
   */
  InitView(app) {
    app.set('view engine', 'ejs');
    app.set('views', this.config.view_path);
  }

  /**
   * Determines from the request header if the requester is HTMX
   * @param {Object} req Express request
   * @returns
   */
  IsHtmx(req) {
    return req.headers['hx-request'] === 'true';
  }
}

module.exports = View;
