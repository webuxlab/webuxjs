// █████╗  ██████╗████████╗██╗ ██████╗ ███╗   ██╗
// ██╔══██╗██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║
// ███████║██║        ██║   ██║██║   ██║██╔██╗ ██║
// ██╔══██║██║        ██║   ██║██║   ██║██║╚██╗██║
// ██║  ██║╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║
// ╚═╝  ╚═╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝

/**
 * File: {{resourceFilename}}
 * Author: {{author}}
 * Date: {{creationDate}}
 * License: {{license}}
 */

"use strict";

const Webux = require("@studiowebux/app");

// action
const {{modelName}} = async {{resourceName}} => {
  await Webux.isValid.Custom(Webux.validators.{{resourceName}}.Something, {{resourceName}});

  const _{{resourceName}} = await Webux.db.{{modelName}}.something({{resourceName}}).catch(e => {
    throw Webux.errorHandler(422, e);
  });
  if (!_{{resourceName}}) {
    throw Webux.errorHandler(422, "{{resourceName}}");
  }

  // the Webux.toObject is optional.
  return Promise.resolve(Webux.toObject(_{{resourceName}}));
};

// route
/**
 * @apiGroup {{modelName}}
 * @api {post} /api/v1/{{resourceName}} Something {{resourceName}}
 * @apiParamExample {json} Request-Example:
 *     {
 *        "{{resourceName}}":{
 *          PUT YOUR SCHEMA HERE
 *        }
 *      }
 * @apiDescription Something {{resourceName}}
 * @apiName Something {{resourceName}}
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 2xx SOMETHING
 *     {
 *           "message": "",
 *           "devMessage": "",
 *           "success": true,
 *           "code": 2xx,
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
    const obj = await {{modelName}}(req.body.{{resourceName}});
    if (!obj) {
      return next(Webux.errorHandler(422, "{{modelName}}"));
    }
    return res.success(obj);
  } catch (e) {
    next(e);
  }
};

// socket
const socket = (client, io) => {
  return async {{resourceName}} => {
    try {
      const obj = await {{modelName}}({{resourceName}});
      if (!obj) {
        throw new Error("{{modelName}}");
      }

      io.emit("{{resourceName}}", obj);  // to broadcast to every connected users
      // client.emit("{{resourceName}}", obj);  // to broadcast to only the connected user
    } catch (e) {
      client.emit("gotError", e.message || e);
    }
  };
};

module.exports = {
  {{modelName}},
  socket,
  route
};
