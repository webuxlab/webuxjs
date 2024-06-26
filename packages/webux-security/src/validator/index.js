/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2019-02-21
 * License: All rights reserved Studio Webux 2015-Present
 */

import Handler from '../defaults/errorHandler.js';

/**
 * Checks the body
 * @param {Object} schema The JOI schema, mandatory
 * @param {Function} errorHandler Custom ErrorHandler, optional
 * @return {Function} return a middleware function
 */
export const Body =
  (schema, errorHandler = Handler) =>
  async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, {
        allowUnknown: false,
      });
      return next();
    } catch (e) {
      return next(errorHandler(400, e.details && e.details[0] ? e.details[0].message : e.details, { type: 'Body Schema Validator' }, e));
    }
  };

/**
 * Checks the params id
 * @param {Object} schema The JOI schema, mandatory
 * @param {Function} errorHandler Custom ErrorHandler, optional
 * @return {Function} return a middleware function
 */
export const MongoID =
  (schema, errorHandler = Handler) =>
  async (req, res, next) => {
    try {
      await schema.validateAsync(req.params.id, {
        allowUnknown: false,
      });
      return next();
    } catch (e) {
      return next(errorHandler(400, e.details && e.details[0] ? e.details[0].message : e.details, { type: 'MongoID Schema Validator' }, e));
    }
  };

/**
 * Checks the params id to check if it is a valid ID
 * @param {Object} schema The JOI schema, mandatory
 * @param {Function} errorHandler Custom ErrorHandler, optional
 * @return {Function} return a middleware function
 */
export const Id =
  (schema, errorHandler = Handler) =>
  async (req, res, next) => {
    try {
      await schema.validateAsync(req.params.id, {
        allowUnknown: false,
      });
      return next();
    } catch (e) {
      return next(errorHandler(400, e.details && e.details[0] ? e.details[0].message : e.details, { type: 'ID Schema Validator' }, e));
    }
  };

/**
 * Checks the params id_url to check if it is a valid URL or mongo ID
 * @param {Object} schema The JOI schema, mandatory
 * @param {Function} errorHandler Custom ErrorHandler, optional
 * @return {Function} return a middleware function
 */
export const MongoIdOrURL =
  (schema, errorHandler = Handler) =>
  async (req, res, next) => {
    try {
      await schema.validateAsync(req.params.id_url, {
        allowUnknown: false,
      });
      return next();
    } catch (e) {
      return next(
        errorHandler(400, e.details && e.details[0] ? e.details[0].message : e.details, { type: 'MongoIDOrURL Schema Validator' }, e),
      );
    }
  };

/**
 * Checks the user
 * @param {Object} schema The JOI schema, mandatory
 * @param {Function} errorHandler Custom ErrorHandler, optional
 * @return {Function} return a middleware function
 */
export const User =
  (schema, errorHandler = Handler) =>
  async (req, res, next) => {
    try {
      await schema.validateAsync(req.user, {
        allowUnknown: true,
      });
      return next();
    } catch (e) {
      return next(errorHandler(400, e.details && e.details[0] ? e.details[0].message : e.details, { type: 'User Schema Validator' }, e));
    }
  };

/**
 * Checks the headers
 * @param {Object} schema The JOI schema, mandatory
 * @param {Function} errorHandler Custom ErrorHandler, optional
 * @return {Function} return a middleware function
 */
export const Headers =
  (schema, errorHandler = Handler) =>
  async (req, res, next) => {
    try {
      await schema.validateAsync(req.headers, {
        allowUnknown: true,
      });
      return next();
    } catch (e) {
      return next(errorHandler(400, e.details && e.details[0] ? e.details[0].message : e.details, { type: 'Headers Schema Validator' }, e));
    }
  };

/**
 * Checks the files
 * @param {Object} schema The JOI schema, mandatory
 * @param {Function} errorHandler Custom ErrorHandler, optional
 * @return {Function} return a middleware function
 */
export const Files =
  (schema, errorHandler = Handler) =>
  async (req, res, next) => {
    try {
      await schema.validateAsync(req.files, {
        allowUnknown: true,
      });
      return next();
    } catch (e) {
      return next(errorHandler(400, e.details && e.details[0] ? e.details[0].message : e, { type: 'File Schema Validator' }, e));
    }
  };

/**
 * Checks a given object
 * @param {Object} schema The JOI schema, mandatory
 * @param {Object} object The object to validate
 * @param {Function} errorHandler Custom ErrorHandler, optional
 * @return {Promise} return a promise
 */
export const Custom = (schema, object, errorHandler = Handler) => {
  try {
    const value = schema.validateAsync(object, {
      allowUnknown: false,
    });
    return Promise.resolve(value);
  } catch (e) {
    throw new Error(
      errorHandler(400, e.details && e.details[0] ? e.details[0].message : e.details, { type: 'Custom Object Schema Validator' }, e),
    );
  }
};
