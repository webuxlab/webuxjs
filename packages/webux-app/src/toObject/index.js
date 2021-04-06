/* eslint-disable no-underscore-dangle */
/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2019-07-17
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

/**
 * Converts a mongoDB array to JSON format
 * @param {Array} array must be an array
 * @returns {JSON} converted array to JSON
 */
function toObject(array) {
  const json = {};
  if (array && (typeof array !== 'object' || !Array.isArray(array))) {
    throw new Error('Function toObject(array) parameter must be an array.');
  }

  array.forEach((element) => {
    json[element._id] = {};
    Object.keys(element).forEach((key) => {
      json[element._id][key] = element[key];
    });
  });

  return json;
}

module.exports = toObject;
