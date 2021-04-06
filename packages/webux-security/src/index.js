/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2020-06-02
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

const header = require('./modules/header');
const bodyParser = require('./modules/bodyParser');
const cookieParser = require('./modules/cookieParser');
const cors = require('./modules/cors');
const components = require('./modules/components');
const query = require('./query/index');
const validators = require('./validator/index');
const rateLimiter = require('./ratelimiter/index');

/**
 * It contains security modules
 * @class Security
 */
class Security {
  /**
   * Initialize the security class
   * @param {Object} opts Module configuration
   * @param {Object} log Custom logger function, by default console
   */
  constructor(opts, log = console) {
    this.config = opts || {};
    this.log = log;
    this.validators = validators;
  }

  /**
   * Configure the Response Header
   * config.server
   * @param {Object} app Express Application
   */
  SetResponseHeader(app) {
    if (!this.config.server) {
      throw new Error('Server configuration is required');
    }
    header(this.config.server, app, this.log);
  }

  /**
   * Configure security modules
   * helmet, compression, disable 'x-powered-by' and trust proxy
   * config
   * @param {Object} app Express Application
   */
  SetGlobal(app) {
    components(this.config, app, this.log);
  }

  /**
   * Configure the bodyParser with express
   * config.bodyParser
   * @param {Object} app Express Application
   */
  SetBodyParser(app) {
    if (!this.config.bodyParser) {
      throw new Error('Body parser configuration is required');
    }
    bodyParser(this.config.bodyParser, app, this.log);
  }

  /**
   * Configure the cookieParser with express
   * config.cookieParser
   * @param {Object} app Express Application
   */
  SetCookieParser(app) {
    if (!this.config.cookieParser) {
      throw new Error('Cookie parser configuration is required');
    }
    cookieParser(this.config.cookieParser, app, this.log);
  }

  /**
   * Configure cors
   * config.cors.whitelist
   * @param {Object} app Express Application
   */
  SetCors(app) {
    if (!this.config.cors || !this.config.cors.whitelist) {
      throw new Error('Cors configuration is required');
    }
    cors(this.config.cors.whitelist, app, this.log);
  }

  /**
   * Configure the queryParser 'req.query' with express
   * @static
   * @param {Array} blacklist An array of blacklisted elements,
   * example, ["password", "refreshToken", ...]
   * @param {String} defaultSelect Default select, example, 'username creationDate ...'
   * @returns {Function} The express middleware function
   */
  static QueryParser(blacklist = [], defaultSelect = '', errorHandler = null) {
    return query(blacklist, defaultSelect, errorHandler);
  }

  /**
   * Create the rate limiters with express
   * config.rateLimiters[]
   * @param {Object} app Express Application
   */
  CreateRateLimiters(app) {
    if (!this.config.rateLimiters) {
      throw new Error('Rate limiters configuration is required');
    }
    this.config.rateLimiters.forEach((limiter) => {
      rateLimiter(limiter, app, this.log);
    });
  }
}

module.exports = Security;
