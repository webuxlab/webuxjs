/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2020-05-04
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

const { v1 } = require('uuid');
const crypto = require('crypto');
const GetIP = require('../ip/index');

/**
 * It formats the response to send it back to the client.
 * @param {Object} res The response object, from express
 * @param {Number} code HTTP Code
 * @param {Object} error The error object
 * @param {Object} log Custom logger, by default : console
 * @returns {Function} It returns a response to send to the client
 */
function response(res, code, error = {}) {
  console.debug(res);
  // If the response is overwritten by the router (webux-route)
  if (res.custom) {
    return res.custom(code, error);
  }
  return res.status(code).json(error);
}

/**
 * It catches the resources that are not defined.
 * Returns 404
 * @param {Object} i18n The i18n object to translate the error returned, default : null
 * @param {Object} log The custom logger, default : console
 * @returns {Function} Returns the middleware to catch the not found
 */
const NotFoundHandler = (i18n = null, log = console) => {
  log.debug('Webux-errorhandler - Creating the Resource Not Found Handler');
  // catch 404 and forward to error handler
  // if no router get the request we hit this one.
  return (req, res, next) => {
    // eslint-disable-next-line no-underscore-dangle
    const msg = i18n ? i18n.__('ROUTE_NOT_FOUND') : 'Route not found';
    log.error('Route Not Found, Please Refer To Documentation.');
    const err = new Error(msg);
    err.code = 404;
    err.message = msg;
    return next(err);
  };
};

/**
 * This function needs to be added at the end,
 * it will catch the error generated.
 * After loading the routes you can add this module to handle errors.
 * To throw error, use errorHandler and NotFoundHandler functions.
 * This function initilializes the global error handler
 * @param {Object} log The log function, optional
 * @return {Function} Returns the middleware to intercept the error. (app.use())
 */
const GlobalHandler = (log = console) => {
  log.debug('Webux-errorhandler - Creating the Global Error Handler');

  return (err, req, res, next) => {
    const error = {
      message: err.message || '',
      devMessage: err.devMessage || '',
      extra: {
        user: err.extra || {},
        req: {
          method: req.method,
          url: req.url,
          ip: GetIP(req),
        },
        stack: err.stack,
      },
    };

    // It allows to sort the recurence easily in the logging system
    error.hash = crypto.createHmac('sha256', 'logging').update(JSON.stringify(error)).digest('hex');

    // It timestamps the entry and allows the user to contact us with the code,
    // that way we can check quickly the issue.
    error.refCode = v1();

    // Send the error to the logger
    log.error(error);

    if (process.env.NODE_ENV !== 'production') {
      // In development, we want to see everything
      return response(res, err.code || 500, error);
    }
    // In production, we want to limit the information sent to clients
    return response(res, err.code || 500, {
      message: err.message,
      success: false,
      refCode: error.refCode,
    });
  };
};

/**
 * Returns new error with a specific format.
 * It allows to send errors in a global error handler
 * and centralizes the error management.
 * @param {Number} code The code of the HTTP status, optional
 * @param {String} msg The message to return, optional
 * @param {Object} extra any extra fields to return, optional
 * @param {String} devMsg The development message to return, optional
 * @returns {Error} returns an error object
 */
const Handler = (code, msg, extra, devMsg) => {
  const error = new Error();

  error.code = code || 500;
  error.message = msg || '';
  error.extra = extra || {};
  error.devMessage = devMsg || '';

  return error;
};

module.exports = { Handler, GlobalHandler, NotFoundHandler };
