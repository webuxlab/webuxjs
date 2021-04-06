/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2020-04-08
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

const fs = require("fs");
const path = require("path");
const { FirstLetterCaps } = require("../lib/helpers");

// List of words prohibited,
// this is according of the socket.io documentation
const reserved = [
  "error",
  "connect",
  "disconnect",
  "disconnecting",
  "newListener",
  "removeListener",
  "ping",
  "pong",
];

/**
 * It attaches the function with the event name
 * If the event uses a reserved word and it is in the _ReservedEvents directory,
 * it use the event name without the path like 'disconnect' instead of 'disconnectParentFolder'
 * @param {Object} socket The socket instance
 * @param {String} name The event name
 * @param {Function} fn The socket function to call
 * @param {Object} log The custom logger
 * @return {Object} Returns the socket.on(name, fn)
 */
function SocketOn(socket, name, fn, log) {
  if (
    name.includes("_ReservedEvents") &&
    reserved.includes(name.split("_")[0]) &&
    name.split("_")[0] === "connect"
  ) {
    log.debug(
      `webux-socket - 'SocketOn' - Adding 'onConnect' function "${
        name.split("_")[0]
      }" to the socket`
    );
  } else if (
    name.includes("_ReservedEvents") &&
    reserved.includes(name.split("_")[0])
  ) {
    log.debug(
      `webux-socket - 'SocketOn' - Attaching 'reserved event' "${
        name.split("_")[0]
      }" to the socket`
    );
    return socket.on(name.split("_")[0], fn);
  } else {
    log.debug(`webux-socket - 'SocketOn' - Attaching "${name}" to the socket`);
    return socket.on(name, fn);
  }
}

/**
 * It attaches the function to the socket
 * @param {Object} _path A list of paths to parse or a specific JS file path
 * @param {Object} socket The socket instance
 * @param {Object} io The Socket.IO instance
 * @param {Object} log Custom logger function
 * @param {Boolean} recursionAllowed It allows to check directories within the parent directory
 * @param {String} parent The last known parent, use along with the recursion
 * @return {VoidFunction} It attaches the socket to the socket object pass in parameter
 */
function AttachAction(
  _path,
  socket,
  io,
  log,
  recursionAllowed,
  ignoreFirstDirectory,
  parent = ""
) {
  if (
    fs.existsSync(path.join(_path)) &&
    fs.lstatSync(path.join(_path)).isDirectory()
  ) {
    log.debug(
      `webux-socket - 'AttachAction' - Get actions for this path "${_path}"`
    );
    const actions = fs.readdirSync(_path);
    // if this function is called from the recursive, the parent will be defined,
    // we want to append it to create something like
    // findProfilePrivate instead of findPrivate
    // ./profile/private/find.j

    let parentFolder = "";
    if (!ignoreFirstDirectory) {
      parentFolder =
        FirstLetterCaps(parent) +
        FirstLetterCaps(
          _path.split(path.sep)[_path.split(path.sep).length - 1]
        );

      log.debug(
        `webux-socket - 'AttachAction' - Current Parent Folder "${parentFolder}"`
      );
    }

    log.debug(
      `webux-socket - 'AttachAction' - Get all actions within this path "${actions}"`
    );
    actions.forEach((_method) => {
      if (
        !_method.includes(".js") ||
        !require(path.resolve(path.join(_path, _method))).socket
      ) {
        if (
          fs.existsSync(path.join(_path, _method)) &&
          fs.lstatSync(path.join(_path, _method)).isDirectory() &&
          recursionAllowed
        ) {
          // call the function again if this is a directory
          return AttachAction(
            path.join(_path, _method),
            socket,
            io,
            log,
            recursionAllowed,
            false,
            parentFolder
          );
        }
        log.debug(
          `webux-socket - 'AttachAction' - Invalid Method ${_path}/${_method}`
        );
        return _method;
      }
      log.debug(
        `webux-socket - 'AttachAction' - Attaching the method "${_method}"`
      );
      const name = _method.split(".js")[0] + parentFolder;

      log.debug(`webux-socket - 'AttachAction' - Method name "${name}"`);

      return SocketOn(
        socket,
        name,
        require(path.resolve(path.join(_path, _method))).socket(socket, io),
        log
      );
    });
  } else if (
    fs.existsSync(path.join(_path)) &&
    fs.lstatSync(path.join(_path)).isFile() &&
    _path.includes(".js") &&
    require(path.resolve(path.join(_path))).socket
  ) {
    const parentFolder = FirstLetterCaps(
      _path.split(path.sep)[_path.split(path.sep).length - 2]
    );
    log.debug(
      `webux-socket - 'AttachAction' - Current Parent Folder "${parentFolder}"`
    );

    const method = _path.split(path.sep)[_path.split(path.sep).length - 1];

    log.debug(
      `webux-socket - 'AttachAction' - Attaching the method "${method}"`
    );
    const name = method.split(".js")[0] + parentFolder;

    log.debug(`webux-socket - 'AttachAction' - Method name "${name}"`);

    log.debug(
      `webux-socket - 'AttachAction' - Attaching the method "${method}" with name "${name}" to the socket`
    );
    return SocketOn(
      socket,
      name,
      require(path.resolve(path.join(_path))).socket(socket, io),
      log
    );
  } else {
    log.error(`webux-socket - 'AttachAction' - Invalid Path ${_path}`);
  }
}

/**
 * Iterating in each folder and attach actions if they export the socket function.
 * @param {Object} log The custom logger function
 * @param {Object} config The configuration for the socket
 * @param {Object} socket The socket for a specific namespace
 * @param {Object} io The Socket.IO instance
 * @param {Object} paths The list of paths to iterate and attach socket if they are defined
 * @return {Function<socket, io, paths>} Returns a function(socket, io, paths)
 */
function AttachActions(log, config) {
  return (socket, io, paths) => {
    log.debug(
      `webux-socket - 'AttachAction' - List of paths to be iterated "${paths}"`
    );
    paths.forEach((_path) =>
      AttachAction(
        _path,
        socket,
        io,
        log,
        config.recursionAllowed,
        config.ignoreFirstDirectory
      )
    );
  };
}

/**
 * Call the AttachActions based on the configuration file
 */
function Actions() {
  if (!this.config || !this.config.namespaces) {
    throw new Error("No Namespace defined");
  }

  Object.keys(this.config.namespaces).forEach((namespace) => {
    const paths = this.config.namespaces[namespace];

    if (namespace === "default") {
      this.log.debug(
        "webux-socket - 'LoadActions' - Adding the 'default' namespace"
      );
      this.io.on("connection", (socket) => {
        this.log.debug(
          "webux-socket - 'LoadActions' - Attaching the actions to the 'default' namespace"
        );
        AttachActions(this.log, this.config)(socket, this.io, paths);
        this.log.debug(
          "webux-socket - 'LoadActions' - Actions attached the 'default' namespace"
        );
      });
    } else {
      this.log.debug(
        `webux-socket - 'LoadActions' - Adding the '${namespace}' namespace`
      );
      this.io.of(`/${namespace}`).on("connection", (socket) => {
        this.log.debug(
          `webux-socket - 'LoadActions' - Attaching the actions to the '/${namespace}' namespace`
        );
        AttachActions(this.log, this.config)(
          socket, // socket
          this.io.of(`/${namespace}`), // io
          paths
        );
        this.log.debug(
          `webux-socket - 'LoadActions' - Actions attached the '/${namespace}' namespace`
        );
      });
    }
  });
}

module.exports = Actions;
