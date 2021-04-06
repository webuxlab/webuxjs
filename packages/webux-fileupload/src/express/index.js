/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2020-05-10
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

"use strict";

const fileUpload = require("express-fileupload");

/**
 * The express middleware to upload files
 * @param {Object} options The options to configure the fileupload module
 * @returns {Function} the express-fileupload module configured
 */
function fileUploadMiddleware(options) {
  
  return fileUpload(options);
}

module.exports = { fileUploadMiddleware };
