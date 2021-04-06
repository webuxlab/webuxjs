// █████╗  ██████╗████████╗██╗ ██████╗ ███╗   ██╗
// ██╔══██╗██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║
// ███████║██║        ██║   ██║██║   ██║██╔██╗ ██║
// ██╔══██║██║        ██║   ██║██║   ██║██║╚██╗██║
// ██║  ██║╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║
// ╚═╝  ╚═╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝

/**
 * File: {{moduleFilename}}
 * Author: {{author}}
 * Date: {{creationDate}}
 * License: {{license}}
 */

"use strict";

const Webux = require("@studiowebux/app");

// action
const find{{modelName}} = async query => {
  const {{plurial}} = await Webux.db.{{modelName}}.find({})
    .lean()
    .select(query.projection || Webux.constants.{{moduleName}}.select)
    .limit(query.limit)
    .sort(query.sort)
    .catch(e => {
      throw Webux.errorHandler(422, e);
    });
  if (!{{plurial}} || {{plurial}}.length === 0) {
    throw Webux.errorHandler(404, "{{plurial}} not found");
  }
  // the Webux.toObject is optional.
  return Promise.resolve(Webux.toObject({{plurial}}));
};

// route
/**
 * @apiGroup {{modelName}}
 * @api {get} /api/v1/{{moduleName}} Get all {{plurial}}
 * @apiDescription Get all {{plurial}}
 * @apiName Get all {{plurial}}
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *           "message": "",
 *           "devMessage": "",
 *           "success": true,
 *           "code": 200,
 *           "body": {
 *              PUT YOUR SCHEMA HERE
 *           }
 *       }
 */
const route = async (req, res, next) => {
  try {
    const obj = await find{{modelName}}(req.query);
    if (!obj) {
      return next(Webux.errorHandler(404, "{{modelName}} not found."));
    }
    return res.success(obj);
  } catch (e) {
    next(e);
  }
};

// socket
const socket = (client, io) => {
  return async (fn) => {
    try {
      const obj = await find{{modelName}}({});
      if (!obj) {
        throw new Error("{{modelName}} not found");
      }

      client.emit("{{moduleName}}Found", obj);
      fn(true) // Callback for ACK (https://socket.io/docs/#Sending-and-getting-data-acknowledgements)
    } catch (e) {
      client.emit("gotError", e.message || e);
    }
  };
};

module.exports = {
  find{{modelName}},
  socket,
  route
};
