/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2019-02-26
 * License: All rights reserved Studio Webux 2015-Present
 */

import filter from 'wordfilter';
import parser from 'mongo-qp';
import Trim from './trim.js';
import Handler from '../defaults/errorHandler.js';
const { ParseQuery } = parser;

/**
 *Check if the query parameters are safe.
 * @param {Array} deniedKeys The list of deniedKeysed elements, Mandatory
 * @param {Array} defaultSelect the default select values, Mandatory
 * @param {Function} errorHandler Custom ErrorHandler, optional
 * @return {Function} This is a middleware, if something wrong, return 400, otherwise continue.
 */
export default (deniedKeys, defaultSelect, errorHandler = null) =>
  (req, res, next) => {
    try {
      if (!errorHandler) {
        errorHandler = Handler;
      }
      // Nothing to do
      if (!req.query) {
        return next();
      }

      // Define words deniedKeysed
      // When a user request specific information, we want to protect the sensitive datas.
      if (deniedKeys && deniedKeys.length > 0) {
        filter.addWords(deniedKeys);
        if (filter.deniedKeysed(JSON.stringify(req.query))) {
          throw new Error('Query may contains deniedKeysed items.');
        }
      }

      const parsedQuery = ParseQuery(req.query);

      // create custom projection
      if (parsedQuery.projection) {
        parsedQuery.projection = Trim(parsedQuery.projection, deniedKeys, defaultSelect);
      } else {
        parsedQuery.projection = defaultSelect; // return the default select
      }
      req.query = parsedQuery; // overwrite the req.query and continue...
      return next();
    } catch (e) {
      return next(errorHandler(400, 'INVALID_REQUEST', {}, e.message));
    }
  };
