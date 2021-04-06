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
const updateOne{{modelName}} = async ({{moduleName}}ID, {{moduleName}}) => {
  await Webux.isValid.Custom(Webux.validators.{{moduleName}}.MongoID, {{moduleName}}ID);
  await Webux.isValid.Custom(Webux.validators.{{moduleName}}.Update, {{moduleName}});

  const {{moduleName}}Updated = await Webux.db.{{modelName}}.findByIdAndUpdate(
    {{moduleName}}ID,
    {{moduleName}},
    {
      new: true
    }
  ).catch(e => {
    throw Webux.errorHandler(422, e);
  });
  if (!{{moduleName}}Updated) {
    throw Webux.errorHandler(422, "{{moduleName}} not updated");
  }
  // the Webux.toObject is optional.
  return Promise.resolve(Webux.toObject({{moduleName}}Updated));
};

// route
/**
 * @apiGroup {{modelName}}
 * @api {put} /api/v1/{{moduleName}}/:id Update a {{moduleName}}
 * @apiParam {string} id 
 * @apiParamExample {json} Request-Example:
 *     {
 *        "{{moduleName}}":{
 *          PUT YOUR SCHEMA HERE
 *        }
 *      }
 * @apiDescription Update a {{moduleName}}
 * @apiName Update a {{moduleName}}
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *           "message": "",
 *           "devMessage": "",
 *           "success": true,
 *           "code": 200,
 *           "body": {
 *               PUT YOUR SCHEMA HERE
 *               "created_at": "2019-07-17T23:30:49.819Z",
 *               "updated_at": "2019-07-17T23:30:49.819Z",
 *               "__v": 0
 *           }
 *       }
 */
const route = async (req, res, next) => {
  try {
    const obj = await updateOne{{modelName}}(req.params.id, req.body.{{moduleName}});
    if (!obj) {
      return next(Webux.errorHandler(422, "{{modelName}} with ID not updated."));
    }
    return res.updated(obj);
  } catch (e) {
    next(e);
  }
};

// socket
const socket = (client, io) => {
  return async ({{moduleName}}ID, {{moduleName}}, fn) => {
    try {
      const obj = await updateOne{{modelName}}({{moduleName}}ID, {{moduleName}});
      if (!obj) {
        throw new Error("{{modelName}} with ID not updated");
      }

      io.emit("{{moduleName}}Updated", obj); // to broadcast to every connected users
      // client.emit("{{moduleName}}Updated", obj); // to broadcast to only the client
      fn(true) // Callback for ACK (https://socket.io/docs/#Sending-and-getting-data-acknowledgements)
    } catch (e) {
      client.emit("gotError", e);
    }
  };
};

module.exports = {
  updateOne{{modelName}},
  socket,
  route
};
