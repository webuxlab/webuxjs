/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2018-07-05 - reworked 2020-04-30
 * License: All rights reserved Studio Webux 2015-Present
 */

import http from 'node:http';
import https from 'node:https';
import cluster from 'node:cluster';

import header from './helpers/header.js';
import { normalizePort, setNumCores, onError, onClose, onListening, parseSSL, UpdatePort } from './helpers/tools.js';

/**
 * Creates a simple HTTP or HTTPS server or a cluster.
 * @class Server
 */
export default class Server {
  /**
   *
   * @param {*} opts The options to configure the server
   * @param {*} app The expressJS app or the handler function
   * @param {*} log Custom logger function (Default: console)
   * @constructor
   */
  constructor(opts, app, log = console) {
    if (!opts) {
      throw new Error('The mandatory options are required');
    }
    this.log = log;
    this.config = opts;

    // Express Application
    // const app = express();
    // function handler (req, res) { ... }
    this.app = app;

    this.port = normalizePort(this.config.port || 0);

    // Set ENV
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';
    process.env.PORT = this.port;

    // Configure the SSL if enabled
    this.ssl = this.config.ssl && this.config.ssl.enabled ? parseSSL(this.config.ssl) : null;

    this.server = null;
  }

  /**
   * Start the server based on the configuration
   * @returns {Promise<Object>} It returns the server instance
   */
  StartServer() {
    return new Promise((resolve) => {
      if (this.ssl) {
        this.log.info(`webux-server - (${process.pid}) Starting an HTTPS server ...`);
        this.server = https.createServer(this.ssl, this.app);
      } else {
        this.log.info('webux-server - Starting an HTTP server ...');
        this.server = http.createServer(this.app);
      }

      this.log.debug(`webux-server - (${process.pid}) Set the application port to ${this.port}`);

      // Events
      this.server.on('error', onError);
      this.server.on('close', onClose(this.log));
      this.server.on('listening', onListening(this.server, this.log));

      // Graceful shutdown
      process.on('SIGTERM', () => {
        this.log.debug('SIGTERM');
        this.server.close((err) => {
          if (err) {
            throw err;
          }
          process.exit(0);
        });
      });

      // Start the server
      this.server.listen(this.port, () => {
        const address = this.server.address();
        this.port = UpdatePort(address.port);

        // Print header
        header(this.config, this.log);

        // Print pid of the process
        this.log.info(`webux-server - Worker ${process.pid} started @ ${address.address}:${address.port}`);

        // return the server instance
        return resolve(this.server);
      });
    });
  }

  /**
   * Start the server in cluster mode
   * @returns {Promise<Object>} It returns the server instance
   */
  StartCluster() {
    // To enable the cluster mode and
    // define the number of cores to use.
    this.cluster = cluster;
    this.numCPUs = setNumCores(this.config.cores);

    if (this.cluster.isMaster) {
      this.log.info(`webux-server - Will start ${this.numCPUs} processes`);
      this.log.info(`webux-server - Master ${process.pid} is running`);

      // Fork workers.
      for (let i = 0; i < this.numCPUs; i += 1) {
        this.cluster.fork();
      }

      this.cluster.on('exit', (worker, code, signal) => {
        this.log.error(`webux-server - worker ${worker.process.pid} died with code : ${code} - ${signal}`);
      });

      return Promise.resolve(this.cluster);
    }
    // Start the server
    return this.StartServer();
  }
}
