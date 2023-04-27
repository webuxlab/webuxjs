/**
 * File: App.js
 * Author: Tommy Gingras
 * Date: 2020-05-03
 * License: All rights reserved Studio Webux 2015-Present
 */

const loadConfiguration = require('./configuration');
const { onRequest, configure } = require('./i18n');
const { GlobalHandler, NotFoundHandler, Handler } = require('./errorhandler');
const getIP = require('./ip');
const idToURL = require('./idToUrl');
const toObject = require('./toObject');

/**
 * The application
 * @class App
 */
class App {
  /**
   * Initialize the application
   * @param {Object} opts
   * @param {Object} log Custom logger, by default: console
   * @returns {VoidFunction}
   */
  constructor(opts, log = console) {
    this.config = opts || {};
    this.log = log;

    this.i18n = null;
  }

  /**
   * It loads the configurations to create a single object
   * It appends the existing one
   * The this.config contains all configurations
   * @param {String} configuration The absolute path where the configuration are stored
   * @returns {Object} The application configuration
   */
  LoadConfiguration(configuration) {
    this.config = {
      ...this.config,
      ...loadConfiguration(configuration || this.config.configuration, this.log),
    };
    return this.config;
  }

  /**
   * It loads the functions and variables from a file to create a single object
   * It creates an object based on all files within the driectory
   * @param {String} modulePath A path
   * @returns {Object} The application configuration
   */
  LoadModule(modulePath) {
    return loadConfiguration(modulePath, this.log);
  }

  /**
   * Converts an ID to an URL
   * @param {String} id must be a id
   * @param {String} resource the module name
   * @param {String} endpoint optional endpoint,
   * by default the value defined in the server will be used.
   * @returns {String} converted id to URL '/endpoint/resource/id'
   */
  // eslint-disable-next-line class-methods-use-this
  IdToURL(id, resource, endpoint) {
    return idToURL(id, resource, endpoint);
  }

  /**
   * Converts a mongoDB array to JSON format
   * @param {Array} array must be an array
   * @returns {Object} converted array to JSON
   */
  // eslint-disable-next-line class-methods-use-this
  ToObject(array) {
    return toObject(array);
  }

  /**
   * It configures the i18n Module
   * @returns {Object} The i18n instance
   */
  ConfigureLanguage() {
    this.i18n = configure(this.config.language, this.log);
    return this.i18n;
  }

  /**
   * Attaches the i18n module to an express instance
   * @returns {Function} The i18n middleware
   */
  I18nOnRequest() {
    return onRequest(this.config.language.availables, this.i18n, this.log);
  }

  /**
   * It guesses the client IP based on the request
   * @param {Object} request The request
   * @returns {String} The client IP
   */
  // eslint-disable-next-line class-methods-use-this
  GetIP(request) {
    return getIP(request);
  }

  /**
   * It formats error and return an error
   * @param {Number} code HTTP Code
   * @param {String} msg The human readable error message
   * @param {Object} extra An object to add supplemental information
   * @param {String} devMsg The error message for the dev. team
   * @returns {Error} It returns an error ready to be catch by the global error handler
   */
  // eslint-disable-next-line class-methods-use-this
  ErrorHandler(code, msg, extra, devMsg) {
    return Handler(code, msg, extra, devMsg);
  }

  /**
   * It catches all errors and return a human friendly message to the user
   * @returns {Function} It returns an express middleware
   */
  GlobalErrorHandler() {
    return GlobalHandler(this.log);
  }

  /**
   * It catches resource that are not defined
   * @returns {Function} It returns an express middleware
   */
  NotFoundErrorHandler() {
    return NotFoundHandler(this.i18n, this.log);
  }
}

module.exports = App;
module.exports.i18n = App.i18n;
