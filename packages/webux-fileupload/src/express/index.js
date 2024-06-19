/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2020-05-10
 * License: All rights reserved Studio Webux 2015-Present
 */

import fileUpload from 'express-fileupload';

/**
 * The express middleware to upload files
 * @param {Object} options The options to configure the fileupload module
 * @returns {Function} the express-fileupload module configured
 */
export function fileUploadMiddleware(options) {
  return fileUpload(options);
}
