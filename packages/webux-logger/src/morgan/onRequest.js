/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2019-05-25
 * License: All rights reserved Studio Webux 2015-Present
 */

import morgan from 'morgan';
import json from 'morgan-json';
import defaultTokens from './defaultRequest.js';

/**
 * this function calls the stream function of winston, it logs the request content.
 * @param {String} type The logging type : json, combined, tiny, dev, common, short,
 * by default: common
 * @param {Object} format The object that contains the structure of what to log.
 * Must be use with the JSON type.
 * @param {Object} tokens To overwrite the default tokens provided,
 * read the morgan token documentation for more details.
 * @param {Object} log The log function, optional
 * @returns {VoidFunction} return nothing
 */
export default (type = 'common', format = null, tokens = null, log = console) => {
  log.info('Webux-logging - Configuring morgan');
  let tokensToIterate = [];

  // Load tokens to intercept and log.
  if (!tokens) {
    tokensToIterate = defaultTokens;
  }

  tokensToIterate.forEach((token) => {
    log.debug(`webux-logging - Adding token '${token.name}' on request`);
    morgan.token(token.name, (req) => {
      const value = token.value ? token.value : token.name;
      const request = token.parent ? req[token.parent][value] : req[value];

      if (token.needStringify === true) {
        return JSON.stringify(request);
      }
      return request;
    });
    return token;
  });

  // To log in JSON format or in some other format,
  // It uses the stream function and filter the request
  // It sanitize the content to remove denied keys
  // information from the log
  let instance = null;

  try {
    if (type === 'json') {
      instance = morgan(json(format), {
        stream: log.stream,
      });
    } else {
      instance = morgan(type, {
        stream: log.stream,
      });
    }
  } catch (e) {
    log.error(`Webux-logging - ${e.message}`);
  }

  return instance;
};
