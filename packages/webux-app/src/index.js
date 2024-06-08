/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2020-05-17
 * License: All rights reserved Studio Webux 2015-Present
 */

import Core from './App.js';
/**
 * Exports the ore as new Object
 * It allows to use the import across multiple modules
 */
export default new Core();

/**
 * It exports the WebuxApp object
 */
export const WebuxApp = Core;
