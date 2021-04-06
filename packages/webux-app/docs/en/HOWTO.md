# How to start with this toolbox

## Step 1 - Prepare the files and folders structure

To get all features, you should have something like this:

```bash
backend/
  .tmp/
  api/
    v1/
      actions/
        _ReservedEvents/
          connect.js
        name/
          create.js
          find.js
          findOne.js
          remove.js
          update.js
      constants/
        name.js
      helpers/
        name.js
      middlewares/
      validations/
        name.js
  app/
    index.js
  bin/
    index.js
  config/
    fileupload.js
    language.js
    logger.js
    route.js
    server.js
    socket.js
    sql.js
  db/
    dev/
    migrations/
    init.js
    run.js
  locales/
  public/
    .gitkeep
  tests/
    cases/
      00_name.spec.js
```

> The `db` directory is setup to use knex.js

## Step 2 - app/ - Define the application

This file contains the application definition,

```javascript
const Webux = require("@studiowebux/app");

const path = require("path");
const express = require("express");
const app = express();

// External Modules
const WebuxServer = require("@studiowebux/server");
const WebuxRoute = require("@studiowebux/route");
const WebuxSQL = require("@studiowebux/sql");
const WebuxSocket = require("@studiowebux/socket");
const WebuxLogger = require("@studiowebux/logger");
const WebuxFileupload = require("@studiowebux/fileupload");
const WebuxSecurity = require("@studiowebux/security");

class MyApp extends Webux.WebuxApp {
  constructor() {
    super();

    /**
     * The express application
     */
    this.express = express;
    this.router = express.Router();
    this.app = app;
  }

  Initialize() {
    this.log.debug("[] Initialize Application");
    /**
     * Load all configurations
     */
    this.config = this.LoadConfiguration(path.join(__dirname, "..", "config"));

    /**
     * Load all Modules and Variables
     */
    this.validators = this.LoadModule(
      path.join("..", "api", "v1", "validators"),
      "validators"
    );

    this.helpers = this.LoadModule(
      path.join("..", "api", "v1", "helpers"),
      "helpers"
    );

    this.constants = this.LoadModule(
      path.join("..", "api", "v1", "constants"),
      "constants"
    );

    this.middlewares = this.LoadModule(
      path.join("..", "api", "v1", "middlewares"),
      "middlewares"
    );

    /**
     * Webux Logger
     */
    this.Logger = new WebuxLogger(this.config.logger);
    this.log = this.Logger.CreateLogger();

    /**
     * Configure the i18n implementation
     */
    this.ConfigureLanguage();

    /**
     * Webux Server
     */
    this.Server = new WebuxServer(this.config.server, this.app, this.log);

    /**
     * Webux Routes and resources
     */
    this.Route = new WebuxRoute(this.config.route, this.log);

    /**
     * Webux SQL
     */
    this.db = new WebuxSQL(this.config.sql, this.log);

    /**
     * Webux Socket.IO
     */
    this.Socket = new WebuxSocket(this.config.socket, null, this.log);

    /**
     * Webux File Upload
     */
    this.FileUpload = new WebuxFileupload(this.config.fileupload, this.log);

    /**
     * Webux Security
     */
    this.Security = new WebuxSecurity(this.config.security, this.log);
    this.Validators = this.Security.validators;

    this.log.debug("[x] Application Initialized");
  }
}

module.exports = new MyApp();
```

Doing that will prepare all modules.

## Step 3 - bin/ - Create the server

```javascript
/**
 * Load the Application modules and configurations
 */
const Webux = require("../app");

(async () => {
  Webux.Initialize();

  Webux.Security.SetResponseHeader(Webux.app);
  Webux.Security.SetBodyParser(Webux.app);
  Webux.Security.SetCookieParser(Webux.app);
  Webux.Security.SetCors(Webux.app);
  Webux.Security.SetGlobal(Webux.app);
  Webux.Security.CreateRateLimiters(Webux.app);

  Webux.app.set("node_env", process.env.NODE_ENV || "development");
  Webux.app.set("port", process.env.PORT || Webux.config.server.port);

  Webux.app.use(Webux.Logger.OnRequest());

  await Webux.Route.LoadResponse(Webux.app);
  await Webux.Route.LoadRoute(Webux.router);

  Webux.router.post(
    "/upload",
    Webux.FileUpload.OnRequest(),
    Webux.FileUpload.UploadRoute()
  );

  Webux.router.get("/download/:file", Webux.FileUpload.DownloadRoute());

  Webux.app.use("/api/v1", Webux.router);

  await Webux.Route.LoadStatic(Webux.app, Webux.express);

  // Server.StartCluster();
  await Webux.Server.StartServer();

  Webux.Socket.Initialize(Webux.Server.server);

  Webux.Socket.Start();
  Webux.Socket.Standalone()
    .of("upload")
    .on("connection", Webux.FileUpload.SocketIO());
})();
```

## Step 3 - /api - The API definition

actions/\_ReservedEvents/connect.js

```javascript
const socket = (client, io) => {
  console.debug(`\|/ webux-socket - Socket ${client.id} connected.`);
};

module.exports = { socket };
```

actions/name/create.js

```javascript
const Webux = require("../../../../app");

// action
const createName = async (name) => {
  await Webux.Validators.Custom(Webux.validators.name.Create, name);

  const nameCreated = await Webux.db
    .sql("name")
    .insert(name)
    .catch((e) => {
      throw Webux.ErrorHandler(422, e);
    });

  if (!nameCreated) {
    throw Webux.ErrorHandler(422, "name not created");
  }

  return Promise.resolve(nameCreated);
};

// route
/**
 * @apiGroup Name
 * @api {post} /api/v1/name Create a name
 * @apiParamExample {json} Request-Example:
 *     {
 *        "name":{
 *          PUT YOUR SCHEMA HERE
 *        }
 *      }
 * @apiDescription Create a name
 * @apiName Create a name
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
    const obj = await createName(req.body.name);
    if (!obj) {
      return next(Webux.ErrorHandler(422, "Name not created"));
    }
    return res.created(obj);
  } catch (e) {
    next(e);
  }
};

// socket
const socket = (client, io) => {
  return async (name, fn) => {
    try {
      const obj = await createName(name);
      if (!obj) {
        throw new Error("Name not created");
      }

      io.emit("nameCreated", obj); // to broadcast to every connected users
      // client.emit("nameCreated", obj);  // to broadcast to only the connected user
      fn(true); // Callback for ACK (https://socket.io/docs/#Sending-and-getting-data-acknowledgements)
    } catch (e) {
      client.emit("gotError", e.message || e);
    }
  };
};

module.exports = {
  createName,
  socket,
  route,
};
```

actions/name/update.js

## TBD