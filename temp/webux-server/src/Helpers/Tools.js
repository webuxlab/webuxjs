/* eslint-disable global-require */
/**
 * File: Tools.js
 * Author: Tommy Gingras
 * Date: 2020-04-30
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

/**
 * Normalize a port into a number, string, or false.
 * @param {Number} port The port to listen
 * @returns {Number} The port parsed as Integer
 */
const normalizePort = (port) => {
  if (parseInt(port, 10) >= 0) {
    return parseInt(port, 10);
  }
  throw new Error('Invalid port !');
};

/**
 * If the port is set to 0, the server will choose one randomly
 * @param {Number} port The port to listen
 * @returns {Number} The port parsed as Integer
 */
const UpdatePort = (port) => {
  // set the environment port to the new port
  process.env.PORT = port;
  return port;
};

/**
 * Event listener for HTTP server "listening" event.
 * @param {Object} server The server instance
 * @param {Object} log The custom logger, by default, this is set to console
 */
const onListening = (server, log = console) => () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  log.info(`webux-server - Listening on ${bind}`);
};

/**
 * Event listener for HTTP server "error" event.
 * @param {Object} error The actual error that occured
 * @throws {Error}
 */
const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  // const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
  const bind = `Port ${process.env.PORT}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      throw new Error(`${bind} requires elevated privileges`);
    case 'EADDRINUSE':
      throw new Error(`${bind} is already in use`);
    default:
      throw error;
  }
};

/**
 * Event listener for HTTP server "close" event.
 * @param {Object} log The custom logger, by default, this is set to console
 * @returns {VoidFunction}
 */
const onClose = (log = console) => () => {
  log.info(`PID : ${process.pid} -> Server Closed`);
};

/**
 * It returns the number of cores to use, if undefined, it will use all available cores
 * @param {Number} cores The number of cores to use
 * @returns {Number} The cores parse in Integer
 */
const setNumCores = (cores) => parseInt(cores, 10) || require('os').cpus().length;

/**
 * It converts the base64 key and cert to text
 * @param {Object} ssl the key and the cert in base64
 * @returns {Object} The key and cert
 */
const parseSSL = (ssl) => ({
  key: Buffer.from(ssl.key, 'base64').toString('ascii'),
  cert: Buffer.from(ssl.cert, 'base64').toString('ascii'),
});

module.exports = {
  normalizePort,
  onListening,
  onError,
  onClose,
  setNumCores,
  parseSSL,
  UpdatePort,
};
