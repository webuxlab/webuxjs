/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2020-05-17
 * License: All rights reserved Studio Webux 2015-Present
 */

const Core = require('./App');
/**
 * Exports the ore as new Object
 * It allows to use the import across multiple modules
 */
module.exports = new Core();

/**
 * It exports the WebuxApp object
 */
module.exports.WebuxApp = Core;
