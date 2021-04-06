## Introduction

This module has 3 features :

1. Load express routes automatically using a JSON configuration.
2. Load static routes automatically using a JSON configuration.
3. Add custom express responses.

> This module is built to be use with Express.

For more details (EN/FR) : <a href="https://github.com/studiowebux/webux-route/wiki" target="_blank">Wiki</a>

## Installation

```bash
npm install --save @studiowebux/route
```

[NPM](https://www.npmjs.com/package/@studiowebux/route)

## Usage

## Configuration

| Key       | Value                                                     | Description | More info |
| --------- | --------------------------------------------------------- | ----------- | --------- |
| routes    | RestAPI definition, see below for the structure.          |             |           |
| resources | static resources definition, see below for the structure. |             |           |

Example:

```javascript
const opts = {
  routes: {
    "/": {
      resources: {
        "/": [
          {
            method: "get",
            middlewares: [], // By default, this route is publicly available, you should create a middleware to protect this resource.
            action: (req, res, next) => {
              return res.success({
                msg: "Welcome ! The Documentation is available here : /api/",
              });
            },
          },
        ],
        "/healthcheck": [
          {
            method: "get",
            middlewares: [], // By default, this route is publicly available, you should create a middleware to protect this resource.
            action: (req, res, next) => {
              return res.success({ msg: "Pong !" });
            },
          },
        ],
      },
    },
    "/user": {
      resources: {
        "/": [
          {
            method: "get",
            middlewares: [isAuthenticated()],
            action: require(path.join(__dirname, "actions", "user", "find"))
              .route,
          },
          {
            method: "post",
            middlewares: [],
            action: require(path.join(__dirname, "actions", "user", "create"))
              .route,
          },
        ],
        "/:id": [
          {
            method: "get",
            middlewares: [isAuthenticated()],
            action: require(path.join(__dirname, "actions", "user", "findOne"))
              .route,
          },
          {
            method: "put",
            middlewares: [isAuthenticated()],
            action: require(path.join(__dirname, "actions", "user", "update"))
              .route,
          },
          {
            method: "delete",
            middlewares: [isAuthenticated()],
            action: require(path.join(__dirname, "actions", "user", "remove"))
              .route,
          },
        ],
      },
    },
  },
  resources: [
    {
      path: "/public",
      resource: path.join(__dirname, "public"),
    },
    {
      path: "/img",
      resource: path.join(__dirname, "images"),
    },
  ],
};
```

### Functions

#### constructor(opts, log = console)

Initialize the configurations globally.

```javascript
const WebuxRoute = require("@studiowebux/route");
const webuxRoute = new WebuxRoute(opts, console);
```

The `opts` parameter is optional, You can skip the routes and resources definition and pass the configurations manually using the `LoadRoute` & `LoadStatic` function.

The `log` parameter allows to use a custom logger, by default it uses the console.

#### LoadRoute(router, routes = null): Promise

It loads the RestAPI routes automatically using a JSON configuration.

##### The JSON structure

- The option must be an object.
- The first object is the parent route
  - Like `http://webuxlab.com/api/v1/healthcheck`, where the last `/` is the parent and `healthcheck` the specific route.
- The parent route has one key named `resources`
  - This object can have multiple specific routes
    - Each specific route has 3 keys
      - **method**: GET, POST, PATCH, DELETE, PUT, OPTIONS
      - **middlewares**: An array of middlewares to use on the specific route, the function will be use in the same order.
      - **action**: Can be the actual function using the express route definition (`(req, res, next)=>{...}`) or a require that export the route (like the user route).
- To use the request parameter, simply use the `:` notation

Using the configuration provided by the module,

```javascript
const express = require("express");
const app = express();
const router = express.Router();

webuxRoute.LoadRoute(router);

app.use("/", router);
```

With the configuration in parameter,

```javascript
const routes = {
  "/": {
    resources: {
      "/": [
        {
          method: "get",
          middlewares: [], // By default, this route is publicly available, you should create a middleware to protect this resource.
          action: (req, res, next) => {
            return res.success({
              msg: "Welcome ! The Documentation is available here : /api/",
            });
          },
        },
      ],
      "/healthcheck": [
        {
          method: "get",
          middlewares: [], // By default, this route is publicly available, you should create a middleware to protect this resource.
          action: (req, res, next) => {
            return res.success({ msg: "Pong !" });
          },
        },
      ],
    },
  },
  "/user": {
    resources: {
      "/:id": [
        {
          method: "put",
          middlewares: [isAuthenticated()],
          action: require(path.join(__dirname, "actions", "user", "update"))
            .route,
        },
      ],
    },
  },
};

webuxRoute.LoadRoute(router, routes);
app.use("/", router);
```

The `routes` parameter is only used when you want to load a different configuration than the one present in the module configuration.In other words, it allows to use multiple configuration besides the global one.
The `router` parameter is provided by Express.

#### LoadStatic(app, express, resources = null): Promise

It loads Static resources routes automatically using a JSON configuration,

##### The JSON structure

- The option must be an array
- each element has 2 keys.
  - **path**: The external path to access the resources.
  - **resource**: The path on the server where the resources are stored.

##### Usage

Using the configuration provided by the module,

```javascript
const express = require("express");
const app = express();
const webuxRoute = new WebuxRoute(opts, console);

webuxRoute.LoadStatic(app, express);
```

With the configuration in parameter,

```javascript
const express = require("express");
const app = express();
const webuxRoute = new WebuxRoute();

const resources = [
  {
    path: "/public",
    resource: path.join(__dirname, "public"),
  },
  {
    path: "/img",
    resource: path.join(__dirname, "images"),
  },
];

webuxRoute.LoadStatic(app, express, resources);
```

The `resources` parameter is only used when you want to load a different configuration than the one present in the module configuration.In other words, it allows to use multiple configuration besides the global one.
The `app` & `express` parameters are provided by express.

#### LoadResponse(app): Void

It loads the custom responses and attaches them to the `res` object from Express.

```javascript
const express = require("express");
const app = express();

webuxRoute.LoadResponse(app);
```

##### Custom responses Usage with _res_

```javascript
app.get("/success", (req, res) => {
  res.success({ message: "success" }, "success", "success");
});

app.get("/created", (req, res) => {
  res.created({ message: "created" }, "created", "created");
});

app.get("/updated", (req, res) => {
  res.updated({ message: "updated" }, "updated", "updated");
});

app.get("/deleted", (req, res) => {
  res.deleted({ message: "deleted" }, "deleted", "deleted");
});

app.get("/forbidden", (req, res) => {
  // msg, devMsg
  res.forbidden();
});

app.get("/badrequest", (req, res) => {
  // msg, devMsg
  res.badRequest();
});

app.get("/servererror", (req, res) => {
  // msg, devMsg
  res.serverError();
});

app.get("/notFound", (req, res) => {
  // msg, devMsg
  res.notFound();
});

app.get("/unprocessable", (req, res) => {
  // msg, devMsg
  res.unprocessable();
});

app.get("/custom", (req, res) => {
  res.custom(200, { message: "Custom  response", user: "User Name" });
});
```

## Quick start

### Complete example

#### Step 1. Directories creation

| Répertoire | Description                                                                          |
| ---------- | ------------------------------------------------------------------------------------ |
| actions/\* | The application logic (See the `example/actions` directory to see all possibilities) |
| images     | It stores the images                                                                 |
| public     | It stores the public resources, like _html_ files and others                         |
| config.js  | The routes and resources JSON configuration                                          |
| index.js   | The server using ExpressJS                                                           |

#### Step 2. Action example

actions/user/find.js

```javascript
const route = async (req, res, next) => {
  return res.success({ msg: "Find User", user: { fullname: "John Doe" } });
};

module.exports = { route };
```

#### Step 3. The configuration

config.js

```javascript
const path = require("path");

// Include the middlewares somehow...
const isAuthenticated = () => {
  return (req, res, next) => {
    console.log("The user must be authenticated to execute the action...");
    return next();
  };
};

module.exports = {
  routes: {
    "/": {
      resources: {
        "/": [
          {
            method: "get",
            middlewares: [], // By default, this route is publicly available, you should create a middleware to protect this resource.
            action: (req, res, next) => {
              return res.success({
                msg: "Welcome ! The Documentation is available here : /api/",
              });
            },
          },
        ],
        "/healthcheck": [
          {
            method: "get",
            middlewares: [], // By default, this route is publicly available, you should create a middleware to protect this resource.
            action: (req, res, next) => {
              return res.success({ msg: "Pong !" });
            },
          },
        ],
      },
    },
    "/user": {
      resources: {
        "/": [
          {
            method: "get",
            middlewares: [isAuthenticated()],
            action: require(path.join(__dirname, "actions", "user", "find"))
              .route,
          },
        ],
      },
    },
  },
  resources: [
    {
      path: "/public",
      resource: path.join(__dirname, "public"),
    },
    {
      path: "/img",
      resource: path.join(__dirname, "images"),
    },
  ],
};
```

#### Step 4. Server File

index.js

```javascript
const WebuxRoute = require("../src/index");
const express = require("express");
const app = express();
const router = express.Router();
const options = require("./config");

const webuxRoute = new WebuxRoute(options, console);

(async () => {
  await webuxRoute.LoadResponse(app);
  await webuxRoute.LoadRoute(router);

  app.use("/", router);

  // must be added after load the REST API routes.
  await webuxRoute.LoadStatic(app, express);

  app.listen(1337, () => {
    console.log("Server is listening on port 1337");
  });
})();
```

## Videos and other resources

## Contribution

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## license

SEE LICENSE IN license.txt
