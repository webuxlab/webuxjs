## Introduction

This module offers multiple features:

1. Load configurations from a directory to a variable named `config`
2. Manage errors
3. Translate directly from the backend
4. Convert ID to URL
5. Guess the IP address of the client
6. Convert MongoDB arrays to object
7. Load modules in named variables

> This module is built to be used as the base of the application.

For more details (EN/FR) : <a href="https://github.com/studiowebux/webux-app/wiki" target="_blank">Wiki</a>

## Installation

```bash
npm install --save @studiowebux/app
```

[NPM](https://www.npmjs.com/package/@studiowebux/app)

## Usage

## Configuration

| Key           | Value                                                                  | Description | More info |
| ------------- | ---------------------------------------------------------------------- | ----------- | --------- |
| configuration | An absolute path to the directory that contains all the configurations |             |

Example:

```javascript
const opts = {
  configuration: path.join(__dirname, "..", "config"),
};
```

### Functions

#### constructor(opts, log = console)

Initialize the `config` variable,

```javascript
const WebuxApp = require("@studiowebux/app");

let webuxApp = new WebuxApp(
  {
    configuration: path.join(__dirname, "..", "config"),
  },
  console
);
```

The `opts` parameter is optional.

#### LoadConfiguration(): Object

To load the configurations using the path specified during the initialization,

```javascript
const WebuxApp = require("../src/index");
const path = require("path");
const options = {
  configuration: path.join(__dirname, "config"),
};

const webuxApp = new WebuxApp(options);

webuxApp.LoadConfiguration();
```

It is also possible to add configurations manually,

```javascript
webuxApp.config._manual = {
  testing: "test1",
};
```

The `LoadConfiguration` function append the configurations.

#### LoadModule(modulePath): Object

This function adds exported variables from a file in a centralized variable.

For example, to load all **helpers** functions in this variable `helpers.*`

Proceed as follow,

```javascript
const constants = webuxApp.LoadModule(
  path.join(__dirname, "api", "v1", "constants")
);

const validations = webuxApp.LoadModule(
  path.join(__dirname, "api", "v1", "validations")
);

const helpers = webuxApp.LoadModule(
  path.join(__dirname, "api", "v1", "helpers")
);

const middlewares = webuxApp.LoadModule(
  path.join(__dirname, "api", "v1", "middlewares")
);

console.log(constants);
console.log(helpers);
console.log(middlewares);
console.log(validations);
```

The files must have a specific structure:

helpers/user.js

```javascript
function GetUsers() {
  return ["user1", "user2", "user3"];
}

let users = ["Default User 1", "Default User 2"];

module.exports = {
  GetUsers,
  users,
};
```

Variables and functions are accessible doing :

- `helpers.user.users`
- `helpers.user.GetUsers()`

The `modulePath` is mandatory, This value is the absolute path of the directory that has all modules to import.

#### IdToURL(id, resource, endpoint): String

This function returns an URL based on the information received in parameters.

For example,  
A user with this id: **346**

```javascript
const WebuxApp = require("@studiowebux/app");
const webuxApp = new WebuxApp();

const URL = webuxApp.IdToURL(346, "user", "https://webuxlab.com/api/v1");
```

The result : `https://webuxlab.com/api/v1/user/346`

The `id` parameter is mandatory, This value is the resource id.
The `resource` is mandatory, This value is the resource name to create the RESTAPI route
The `endpoint` is optional (By default, The `config.server.endpoint` variable if defined is used), this value is the prefix of the URL.

#### ToObject(array): Object

This function converts a list to an object

> Currently, this function has been only tested with results from MongoDB

```javascript
let users = [
  { _id: "12345abc22...", name: "test" },
  { _id: "12345abc23...", name: "test2" },
  { _id: "12345abc24...", name: "test3" },
];
console.log(webuxApp.ToObject(users));
```

The result:

```bash
{
  '12345abc22...': { _id: '12345abc22...', name: 'test' },
  '12345abc23...': { _id: '12345abc23...', name: 'test2' },
  '12345abc24...': { _id: '12345abc24...', name: 'test3' }
}
```

The `array` is mandatory, The value must be an array with objects, each object must have this key `_id` to create the mapping.

#### ConfigureLanguage(): Object

This function configures the i18n. It uses this one from NPM : [i18n](https://www.npmjs.com/package/i18n)

This function returns the configured `i18n` object. Also the module is available using `webuxApp.i18n`

This function requires a configuration,

> For all available options, read the official documentation.

```javascript
const path = require("path");
const language = {
  availables: ["fr", "en"],
  directory: path.join(__dirname, "..", "locales"),
  default: "en",
  autoReload: true,
  syncFiles: true,
};
```

Example,

Without loading the configurations automatically,

index.js

```javascript
const WebuxApp = require("@studiowebux/app");
const webuxApp = new WebuxApp();

// To configure the i18n
webuxApp.config.language = language;

const i18n = webuxApp.ConfigureLanguage();
```

With the configurations loaded automatically,
config/language.js

```javascript
const path = require("path");
module.exports = {
  availables: ["fr", "en"],
  directory: path.join(__dirname, "..", "locales"),
  default: "en",
  autoReload: true,
  syncFiles: true,
};
```

index.js

```javascript
const path = require("path");
const WebuxApp = require("@studiowebux/app");
const webuxApp = new WebuxApp({
  configuration: path.join(__dirname, "config"),
});

const i18n = webuxApp.ConfigureLanguage();
```

#### I18nOnRequest(): Function

This function adds the i18n directly in the express routes (`res.__`)  
For more details, read the official documentation : [i18n](https://www.npmjs.com/package/i18n)

This function is used with `app.use()` from Express.

Usage:

```javascript
const express = require("express");
const path = require("path");
const app = express();
const WebuxApp = require("@studiowebux/app);

const webuxApp = new WebuxApp({configuration: path.join(__dirname, "config")});

webuxApp.LoadConfiguration();

const i18n = webuxApp.ConfigureLanguage();

app.use(webuxApp.I18nOnRequest());

app.get("/", (req, res) => {
  console.log(webuxApp.i18n.getLocale());

  res.status(200).send({ msg: res.__("MSG_BONJOUR"), lang: i18n.getLocale() });
});

app.listen(1337, () => {
  console.log("Server is listening on port 1337");
});
```

As shown in the example, there is three ways to use this module,

1. webuxApp.i18n.\*
2. i18n.\*
3. res.\_\_()

#### GetIP(request): String

This function guesses the client IP address

It reads these variables:

```javascript
req.headers["x-forwarded-for"] ||
  req.connection.remoteAddress ||
  req.socket.remoteAddress ||
  (req.connection.socket ? req.connection.socket.remoteAddress : null);
```

If the address isn't detected, the function returns `null`.

The `reque st` is mandatory, This value is provided by the express router.

For example,

```javascript
...
app.get("/", (req, res) => {
  return res.status(200).send({
    msg: res.__("MSG_BONJOUR"),
    lang: webuxApp.i18n.getLocale(),
    from: webuxApp.GetIP(req),
  });
});
...
```

#### ErrorHandler(code, msg, extra, devMsg): Error

It standardizes the error messages and formats them to facilitate the flow.

Example,

```javascript
const WebuxApp = require("@studiowebux/app");
const webuxApp = new WebuxApp();

app.get("/error", (req, res) => {
  throw webuxApp.ErrorHandler(
    400,
    "Bad Request",
    { test: "An object to add extra information" },
    "Message for the dev. team"
  );
});
```

Request the `/error` route to see the error returned. It uses the HTTP Code **400** with this messages: **Bad Request**, then it also provide a way to add an object containing more details and a message for the developers.

The `code` parameter is optional (_by default, 500_), The HTTP code
The `msg` parameter is optional, A message to inform the user of the error.
The `extra` is optional, An object with extra informations.
The `devMsg` is optional, A message to inform the developers.

#### GlobalErrorHandler(): Function

It intercepts all errors thrown by the `ErrorHandler()` function.  
This function must be use at the end, after loading all routes.

This function is used with `app.use()` from Express.

Par example,

```javascript
const express = require("express");
const path = require("path");
const app = express();
const WebuxApp = require("@studiowebux/app");

const webuxApp = new WebuxApp();

app.get("/hello", (req, res) => {
  return res.status(200).send({
    msg: "Bonjour !",
  });
});

app.get("/error", (req, res) => {
  throw webuxApp.ErrorHandler(
    400,
    "Bad Request",
    { test: "An object to add extra information" },
    "Message for the dev. team"
  );
});

// Must be after all routes definition, including the static resources
app.use(webuxApp.GlobalErrorHandler());

app.listen(1337, () => {
  console.log("Server is listening on port 1337");
});
```

#### NotFoundErrorHandler(): Function

Permet d'intercepter les routes qui ne sont pas trouvées.  
Pour utiliser cette fonction, vous devez l'ajouter avant la fonction `GlobalErrorHandler()`, mais après la définition des routes.

This function is used with `app.use()` from Express.

Example,

```javascript
const express = require("express");
const path = require("path");
const app = express();
const WebuxApp = require("@studiowebux/app");

const webuxApp = new WebuxApp();

app.get("/hello", (req, res) => {
  return res.status(200).send({
    msg: "Bonjour !",
  });
});

app.get("/error", (req, res) => {
  throw webuxApp.ErrorHandler(
    400,
    "Bad Request",
    { test: "An object to add extra information" },
    "Message for the dev. team"
  );
});

// Must be after all route definitions, including the static resources
app.use(webuxApp.NotFoundErrorHandler());
app.use(webuxApp.GlobalErrorHandler());

app.listen(1337, () => {
  console.log("Server is listening on port 1337");
});
```

To use the translation with this module, you can use this key `ROUTE_NOT_FOUND`

## Quick Start

### Complete example

#### Step 1. Directories creation

The application is split like this:

```bash
api/
  v1/
    actions/
      user/
        find.js
        findOne.js
        remove.js
        update.js
        create.js
    constants/
      user.js
    helpers/
      user.js
    middlewares/
      isAuthenticated.js
    validations/
      user.js
```

For more details, see the example here : `examples/utils/api/v1`

#### Step 2. The application

app.js

```javascript
const path = require("path");

const WebuxApp = require("../../src/index");
const app = require("express")();

let webuxApp = new WebuxApp({
  configuration: path.join(__dirname, "..", "config"),
});

/**
 * The express application
 */
webuxApp.app = app;

webuxApp.LoadConfiguration();
webuxApp.ConfigureLanguage();

// Add other modules, variables and others ...

module.exports = webuxApp;
```

That way the application is exported and can be imported in the project file to manage everything easily.

#### Step 3. The server

index.js

```javascript
const webuxApp = require("./app");
const { app, ErrorHandler } = webuxApp;

app.use(webuxApp.I18nOnRequest());

app.get("/hello", (req, res) => {
  return res.status(200).send({
    msg: res.__("MSG_BONJOUR"),
    lang: webuxApp.i18n.getLocale(),
    from: webuxApp.GetIP(req),
  });
});

app.get("/error", (req, res) => {
  throw ErrorHandler(
    400,
    res.__("BAD_REQUEST"),
    { test: "An object to add extra information" },
    "Message for the dev. team"
  );
});

app.use(webuxApp.NotFoundErrorHandler());
app.use(webuxApp.GlobalErrorHandler());

app.listen(1337, () => {
  console.log("Server is listening on port 1337");
});
```

This method allows to manage a complex application using a centralized configuration.

### The actions directory

```bash
/api/v1/actions/user/
  find.js
  findOne.js
  remove.js
  update.js
  create.js
```

Those files have a specific structure:

```javascript
// Global webuxApp
const Webux = require("../../../app");

// action
const finduser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const users = await Webux.db.user
        .find()
        .lean()
        .catch((e) => {
          return reject(Webux.errorHandler(422, e));
        });
      if (!users || users.length === 0) {
        return reject(Webux.ErrorHandler(404, "users not found"));
      }

      users.map((user) => {
        user._id = Webux.IdToUrl(user._id, "user", "http://localhost");
      });

      return resolve({
        msg: "Success !",
        users: users,
      });
    } catch (e) {
      throw e;
    }
  });
};

// route
const route = async (req, res, next) => {
  try {
    const obj = await finduser();
    if (!obj) {
      return next(Webux.ErrorHandler(404, "user not found."));
    }
    return res.status(200).json(obj);
  } catch (e) {
    next(e);
  }
};

// socket.IO
const socket = (client) => {
  return async () => {
    try {
      const obj = await finduser();
      if (!obj) {
        client.emit("gotError", "user not found");
      }

      client.emit("userFound", obj);
    } catch (e) {
      client.emit("gotError", e);
    }
  };
};

module.exports = {
  findUser,
  socket,
  route,
};
```

## Videos and other resources

## Contribution

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## license

SEE LICENSE IN license.txt
