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
const removeOne{{modelName}} = async {{moduleName}}ID => {
  await Webux.isValid.Custom(Webux.validators.{{moduleName}}.MongoID, {{moduleName}}ID);

  const {{moduleName}}Removed = await Webux.db.{{modelName}}.findByIdAndRemove(
    {{moduleName}}ID
  ).catch(e => {
    throw Webux.errorHandler(422, e);
  });
  if (!{{moduleName}}Removed) {
    throw Webux.errorHandler(422, "{{moduleName}} not removed");
  }
  return Promise.resolve({{moduleName}}Removed);
};

// route
/**
 * @apiGroup {{modelName}}
 * @api {delete} /api/v1/{{moduleName}}/:id Delete a {{moduleName}}
 * @apiParam {string} id 
 * @apiDescription Delete a {{moduleName}}
 * @apiName Delete a {{moduleName}}
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 204 NO CONTENT
 */
const route = async (req, res, next) => {
  try {
    const obj = await removeOne{{modelName}}(req.params.id);
    if (!obj) {
      return next(Webux.errorHandler(422, "{{modelName}} with ID not deleted."));
    }
    return res.deleted(obj);
  } catch (e) {
    next(e);
  }
};

// socket
const socket = (client, io) => {
  return async ({{moduleName}}ID, fn) => {
    try {
      const obj = await removeOne{{modelName}}({{moduleName}}ID);
      if (!obj) {
        throw new Error("{{modelName}} with ID not deleted");
      }

      io.emit("{{moduleName}}Removed", obj); // to broadcast to every connected users
      // client.emit("{{moduleName}}Removed", obj); // to broadcast to only the client
      fn(true) // Callback for ACK (https://socket.io/docs/#Sending-and-getting-data-acknowledgements)
    } catch (e) {
      client.emit("gotError", e);
    }
  };
};

module.exports = {
  removeOne{{modelName}},
  socket,
  route
};
