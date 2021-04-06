/* eslint-disable no-param-reassign */
/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2020-05-06
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

const defMsg = require('./constants');

/**
 * return success (200)
 * @param {Object} body The body to return to the user, Mandatory
 * @param {String} msg The message for the user, optional
 * @param {String} devMsg The development message for the developer, optional
 * @returns {Object} The response object
 */
function success(body, msg, devMsg) {
  this.status(200);
  this.json({
    message: msg || '',
    devMessage: devMsg || '',
    success: true,
    code: 200,
    body,
  });
}

/**
 * return created (201)
 * @param {Object} body The body to return to the user, Mandatory
 * @param {String} msg The message for the user, optional
 * @param {String} devMsg The development message for the developer, optional
 * @returns {Object} The response object
 */
function created(body, msg, devMsg) {
  this.status(201);
  this.json({
    message: msg || '',
    devMessage: devMsg || '',
    success: true,
    code: 201,
    body,
  });
}

/**
 * return updated (200)
 * @param {Object} body The body to return to the user, Mandatory
 * @param {String} msg The message for the user, optional
 * @param {String} devMsg The development message for the developer, optional
 * @returns {Object} The response object
 */
function updated(body, msg, devMsg) {
  this.status(200);
  this.json({
    message: msg || '',
    devMessage: devMsg || '',
    success: true,
    code: 200,
    body,
  });
}

/**
 * return deleted (204)
 * @param {String} id The id of the deleted resource to return to the user, Mandatory
 * @param {String} msg The message for the user, optional
 * @param {String} devMsg The development message for the developer, optional
 * @returns {Object} The response object
 */
function deleted(id, msg, devMsg) {
  this.status(204);
  this.json({
    message: msg || '',
    devMessage: devMsg || '',
    success: true,
    code: 204,
    id,
  });
}

/**
 * return forbidden (403)
 * @param {String} msg The message for the user, optional
 * @param {String} devMsg The development message for the developer, optional
 * @returns {Object} The response object
 */
function forbidden(msg, devMsg) {
  this.status(403);
  this.json({
    message: msg || defMsg.MSG_FORBIDDEN,
    devMessage: devMsg || defMsg.DEVMSG_FORBIDDEN,
    success: false,
    code: 403,
  });
}

/**
 * return bad request (400)
 * @param {String} msg The message for the user, optional
 * @param {String} devMsg The development message for the developer, optional
 * @returns {Object} The response object
 */
function badRequest(msg, devMsg) {
  this.status(400);
  this.json({
    message: msg || defMsg.MSG_BADREQUEST,
    devMessage: devMsg || '',
    success: false,
    code: 400,
  });
}

/**
 * return server error (500)
 * @param {String} msg The message for the user, optional
 * @param {String} devMsg The development message for the developer, optional
 * @returns {Object} The response object
 */
function serverError(msg, devMsg) {
  this.status(500);
  this.json({
    message: msg || defMsg.MSG_SERVERERROR,
    devMessage: devMsg || '',
    success: false,
    code: 500,
  });
}

/**
 * return not found (404)
 * @param {String} msg The message for the user, optional
 * @param {String} devMsg The development message for the developer, optional
 * @returns {Object} The response object
 */
function notFound(msg, devMsg) {
  this.status(404);
  this.json({
    message: msg || defMsg.MSG_NOTFOUND,
    devMessage: devMsg || defMsg.DEVMSG_NOTFOUND,
    success: false,
    code: 404,
  });
}

/**
 * return custom (xxx)
 * @param {Number} code The code of the HTTP status, Mandatory
 * @param {Object} object it contains the response, Mandatory
 * @returns {Object} The response object
 */
function custom(code, object) {
  this.status(code);
  this.json(object);
}

/**
 * return unprocessable (422)
 * @param {String} msg The message for the user, optional
 * @param {String} devMsg The development message for the developer, optional
 * @returns {Object} The response object
 */
function unprocessable(msg, devMsg) {
  this.status(422);
  this.json({
    message: msg || defMsg.MSG_UNPROCESSABLE,
    devMessage: devMsg || defMsg.DEVMSG_UNPROCESSABLE,
    success: false,
    code: 422,
  });
}

/**
 * return unauthorized (401)
 * @param {String} msg The message for the user, optional
 * @param {String} devMsg The development message for the developer, optiona
 * @returns {Object} The response object
 */
function unauthorized(msg, devMsg) {
  this.status(401);
  this.json({
    message: msg || defMsg.MSG_UNAUTHORIZED,
    devMessage: devMsg || defMsg.DEVMSG_UNAUTHORIZED,
    success: false,
    code: 401,
  });
}

/**
 * Assign the custom responses to express
 * @param {Function} express The express variable, Mandatory
 * @returns {VoidFunction} return nothing.
 */
function hook(express, log = console) {
  log.info('Attach `res.success` response');
  express.response.success = success;
  log.info('Attach `res.created` response');
  express.response.created = created;
  log.info('Attach `res.updated` response');
  express.response.updated = updated;
  log.info('Attach `res.deleted` response');
  express.response.deleted = deleted;
  log.info('Attach `res.forbidden` response');
  express.response.forbidden = forbidden;
  log.info('Attach `res.badRequest` response');
  express.response.badRequest = badRequest;
  log.info('Attach `res.serverError` response');
  express.response.serverError = serverError;
  log.info('Attach `res.notFound` response');
  express.response.notFound = notFound;
  log.info('Attach `res.unauthorized` response');
  express.response.unauthorized = unauthorized;
  log.info('Attach `res.unprocessable` response');
  express.response.unprocessable = unprocessable;
  log.info('Attach `res.custom` response');
  express.response.custom = custom;
}

module.exports = hook;
