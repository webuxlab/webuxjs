/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2019-05-25
 * License: All rights reserved Studio Webux 2015-Present
 */

import { Server } from 'socket.io';

import ConfigureRedis from './helpers/redis/index.js';
import ConfigureAuthentication from './helpers/authentication/index.js';
import LoadActions from './helpers/actions/index.js';

/**
 * @class Socket
 * It exposes Socket.IO with some helpers
 * - Redis
 * - Authentication
 */
export default class Socket {
  /**
   * It initializes the Socket.IO instance
   * @param {Object} opts The configuration
   * @param {Object} server The HTTP server
   * @param {Object} log The custom logger function, by default: console
   */
  constructor(opts, server, log = console) {
    this.config = opts;
    this.log = log;
    if (server) {
      this.io = new Server(server); // Socket io instance with Express or HTTP
    } else {
      log.debug('The io instance is not configured, to initialize it later, use Initialize(server)');
      this.io = null;
    }
  }

  /**
   * To initialize the socket.io instance later in the process
   * @param {Object} server The HTTP server (Mandatory)
   * @returns {Object} The io instance
   */
  Initialize(server) {
    if (server) {
      this.io = new Server(server);
      return this.io;
    }
    throw new Error('A server instance is required');
  }

  /**
   * To start the instance using the automatic actions
   */
  Start() {
    if (!this.io) {
      throw new Error('Socket.IO not initialized');
    }
    this.LoadActions();
  }

  /**
   * To start the instance freely
   * @return {Object} the io instance
   */
  Standalone() {
    if (!this.io) {
      throw new Error('Socket.IO not initialized');
    }
    return this.io;
  }
}

Socket.prototype.AddRedis = ConfigureRedis;
Socket.prototype.AddAuthentication = ConfigureAuthentication;
Socket.prototype.LoadActions = LoadActions;
