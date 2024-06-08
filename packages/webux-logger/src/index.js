/* eslint-disable global-require */
/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2018-07-05 reworked 2020-05-02
 * License: All rights reserved Studio Webux 2015-Present
 */

import morgan from './morgan/onRequest.js';
import winston from './winston/index.js';

/**
 * Creates logger using winston and morgan,
 * it also provides support to custom transport with the ELK suite.
 * @class Log
 */
export default class Log {
  /**
   *
   * @param {Object} opts The options to configure the server (Default: {})
   * @param {Object} log Custom logger function (Default: console)
   * @constructor
   */
  constructor(opts = {}, log = console) {
    this.config = opts;
    this.log = log;
  }

  /**
   * It creates a logger using winston
   * @returns {Object} Returns the log function
   */
  CreateLogger() {
    this.log = winston(this.config);
    return this.log;
  }

  /**
   * It instantiates the request interceptor
   * @returns {Function} It returns the request interceptor to be used with an express app
   * 'app.use()'
   */
  OnRequest() {
    this.log.info('Webux-logging - Configuring the `on request` interceptor');
    return morgan(this.config.type, this.config.format, this.config.tokens, this.log);
  }
}
