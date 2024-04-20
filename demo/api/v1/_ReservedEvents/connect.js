/**
 * File: connect.js
 * Author: Studio Webux
 * Date: 2021-02-17
 * License: MIT
 */

 const { logVerbose } = require('../helpers/logger');

 const socket = (client, io) => {
   logVerbose(`|/ webux-socket - Socket ${client.id} connected.`);
 };
 
 module.exports = { socket };