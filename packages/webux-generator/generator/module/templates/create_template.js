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
const create{{modelName}} = async {{moduleName}} => {
  await Webux.isValid.Custom(Webux.validators.{{moduleName}}.Create, {{moduleName}});

  const {{moduleName}}Created = await Webux.db.{{modelName}}.create({{moduleName}}).catch(e => {
    throw Webux.errorHandler(422, e);
  });
  if (!{{moduleName}}Created) {
    throw Webux.errorHandler(422, "{{moduleName}} not created");
  }

  return Promise.resolve({{moduleName}}Created);
};

// route
/**
 * @apiGroup {{modelName}}
 * @api {post} /api/v1/{{moduleName}} Create a {{moduleName}}
 * @apiParamExample {json} Request-Example:
 *     {
 *        "{{moduleName}}":{
 *          PUT YOUR SCHEMA HERE
 *        }
 *      }
 * @apiDescription Create a {{moduleName}}
 * @apiName Create a {{moduleName}}
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 CREATED
 *     {
 *           "message": "",
 *           "devMessage": "",
 *           "success": true,
 *           "code": 201,
 *           "body": {
 *               "_id": "5d2fafa9f52ba67d93c3b741",
 *                 PUT YOUR SCHEMA HERE
 *               "created_at": "2019-07-17T23:30:49.819Z",
 *               "updated_at": "2019-07-17T23:30:49.819Z",
 *               "__v": 0
 *           }
 *       }
 */
const route = async (req, res, next) => {
  try {
    const obj = await create{{modelName}}(req.body.{{moduleName}});
    if (!obj) {
      return next(Webux.errorHandler(422, "{{modelName}} not created"));
    }
    return res.created(obj);
  } catch (e) {
    next(e);
  }
};

// socket
const socket = (client, io) => {
  return async ({{moduleName}}, fn)=> {
    try {
      const obj = await create{{modelName}}({{moduleName}});
      if (!obj) {
        throw new Error("{{modelName}} not created");
      }

      io.emit("{{moduleName}}Created", obj);  // to broadcast to every connected users
      // client.emit("{{moduleName}}Created", obj);  // to broadcast to only the connected user
      fn(true) // Callback for ACK (https://socket.io/docs/#Sending-and-getting-data-acknowledgements)
    } catch (e) {
      client.emit("gotError", e.message || e);
    }
  };
};

module.exports = {
  create{{modelName}},
  socket,
  route
};
