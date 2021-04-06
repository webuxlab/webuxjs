/* eslint-disable global-require */
/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2019-02-22
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

const path = require('path');

/**
 *
 * @param {Object} availableLanguage The list of supported languages
 * @param {Object} i18n The initialized i18n object
 * @param {Object} log Custom logger, by default : console
 * @returns {Function} The express middleware
 */
const onRequest = (availableLanguage, i18n, log = console) => {
  log.debug('Webux-app - Attach i18n');
  return (req, res, next) => {
    const lang = req.headers && req.headers['accept-language']
      ? req.headers['accept-language']
      : 'en';
    // used to track which language should be added in the app.
    if (
      req.headers['accept-language']
      && !availableLanguage.includes(req.headers['accept-language'])
    ) {
      log.warn(`Language not available, ${req.headers['accept-language']}`);
    }
    i18n.setLocale(lang);

    return i18n.init(req, res, next);
  };
};

/**
 * Initializes the i18n.
 * @param {Object} options The options, the configuration of the i18n module, mandatory
 * @param {Object} log The log function, optional
 * @returns {Object} returns the i18n object
 */
const configure = (options = {}, log = console) => {
  log.debug('Webux-app - Configure i18n');
  const i18n = require('i18n');

  i18n.configure({
    locales: options.availables,
    directory: path.join(options.directory),
    defaultLocale: options.default,
    autoReload: options.autoReload,
    syncFiles: options.syncFiles,
    logDebugFn: options.debug ? (msg) => log.debug(msg) : null,
  });

  return i18n;
};

module.exports = {
  configure,
  onRequest,
};
