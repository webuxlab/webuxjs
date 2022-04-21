/* eslint-disable no-param-reassign */
/**
 * File: filter.js
 * Author: Tommy Gingras
 * Date: 2019-06-22
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

const _ = require('lodash');
const { format } = require('winston');
const cluster = require('cluster');

/**
 * Check if the parent/child contain a blacklisted element, if so, update the value to '*****'
 * @param {Object} processed The empty object, it will be use to append the new values, Mandatory
 * @param {Object} parent The full object to process, Mandatory
 * @param {Object} child An object contained in the parent,
 * (the one to process in that sequence), Mandatory
 * @param {String} find The value that is blacklisted and searched for, Mandatory
 * @returns {Object} Returns the new entry with the modified values if applicable.
 */
const hasBlacklist = (processed, parent, child, find) => {
  // if the current element contains an object,
  if (parent && child && typeof parent[child] === 'object' && Object.keys(parent[child]).length > 0) {
    // create the hierarchy to append the values.
    processed[child] = {};
    // loop within the new temporary parent and use a recursive function.
    Object.keys(parent[child]).forEach((element) => {
      hasBlacklist(processed[child], parent[child], element, find);
    });
  } else {
    // if the current element does not contain an object, but a blacklisted element
    if (child === find) {
      parent[child] = '*****';
    }
    // For all cases append the value in the new object.
    processed[child] = parent[child];
  }

  return processed; // returns the processed object.
};

/**
 * Get the entry to be processed
 * Only filter on body, headers, query, URL and params
 * @param {Object} blacklist The array of blacklisted elements, Mandatory
 * @returns {Object} Returns the new entry with the modified values if applicable.
 */
const filterSecret = (blacklist) =>
  format((info) => {
    // to track on which CPU the task is ran
    info.instance = (cluster.worker ? cluster.worker.id : 1).toString();
    // to track on which PID the task is ran
    info.pid = process.pid.toString();

    // If the message is a simple String
    // it is used mostly when the type is not equal to JSON
    if (info && info.message && blacklist && typeof blacklist.length > 0) {
      if (typeof info.message === 'object') {
        info.message = JSON.stringify(info.message);
      }

      const isSecure = [];
      blacklist.forEach((item) => {
        if (info.message.typeof === 'string' && info.message.includes(item)) {
          info.message.replace(item, '*****');
          isSecure.push(item);
        }
      });

      if (isSecure.length !== 0) {
        info.message = `This message contains blacklisted content [${isSecure.map((i) => `'${i}'`)}]`;
        info.filteredMessage = '*****';
        info.filtered = 'Yes';
      }
    }

    // Checks the complexe object,
    // body, headers, params and query Object
    // url String
    if (blacklist && info && (info.body || info.params || info.headers || info.query || info.url)) {
      const cleaned = {
        body: {},
        headers: {},
        params: {},
        query: {},
        url: '',
      };

      // for each blacklisted element,
      blacklist.forEach((item) => {
        // check if query does not contains blacklisted element.
        if (typeof info.query === 'object') {
          Object.keys(info.query).forEach((query) => {
            hasBlacklist(cleaned.query, info.query, query, item);
          });
        }

        // check if URL does not contains blacklisted element.
        if (typeof info.url === 'string') {
          if (info.url.includes(item)) {
            info.url = '*****';
          }
        }

        // check if body does not contains blacklisted element.
        if (typeof info.body === 'object') {
          Object.keys(info.body).forEach((body) => {
            hasBlacklist(cleaned.body, info.body, body, item);
          });
        }
        // check if headers does not contains blacklisted element.

        if (typeof info.headers === 'object') {
          Object.keys(info.headers).forEach((header) => {
            hasBlacklist(cleaned.headers, info.headers, header, item);
          });
        }
        // check if params does not contains blacklisted element.

        if (typeof info.params === 'object') {
          Object.keys(info.params).forEach((param) => {
            hasBlacklist(cleaned.params, info.params, param, item);
          });
        }
      });

      // Create the new object
      info.body = cleaned.body;
      info.params = cleaned.params;
      info.headers = cleaned.headers;
      info.query = cleaned.query;
      info.url = cleaned.url;
      info.filtered = 'Yes';

      // logstash required that empty objects are removed ...
      Object.keys(info).forEach((item) => {
        if (_.isEmpty(info[item])) {
          info[item] = '{}';
        }
      });
    }

    return info;
  });

module.exports = {
  filterSecret,
};
