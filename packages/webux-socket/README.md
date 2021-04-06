## Introduction

This module uses _Socket.IO_ & _Socket.io-redis_  
Also, The _cookie_ package is used for the authentication.

It offers 4 possibilities

- Adds a function to check if the user is authenticated to access the resources.
- Adds a function to configure the Redis adaptor, this feature allows to connect multiple instances and/or processes together to create a cluster.
- Based on the configuration file, it links the actions automatically in each specified namespaces. The configuration file is flexible to meet most of cases.
- Expose the Socket.IO directly and use it with the native implementation.

> Take note that no explanation about socket.IO are given in this document, please consult the official documentation for that : [Socket.IO](https://socket.io/)

The **examples/** directory has a frontend (made with VueJS) and some backend to do tests and to understand the module and its possibilities.

For more details (EN/FR) : <a href="https://github.com/studiowebux/webux-socket/wiki" target="_blank">Wiki</a>

## Installation

```bash
npm install --save @studiowebux/socket
```

[NPM](https://www.npmjs.com/package/@studiowebux/socket)

## Usage

## Configuration

The configuration is separated in 3 parts,

### authentication

| Key             | Value                                                                         | Description                                                                                                | Plus d’info                                                                                                                            |
| --------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| namespaces      | An Array that contains the namespaces for which the authentication is enabled | NOTE, adding the namespace 'default' will apply the authentication for ALL namespaces                      | [Middleware](https://socket.io/docs/migrating-from-0-9/#Socket-io-uses-middleware-now)                                                 |
| accessTokenKey  | A String that contains the cookie name that has the JWT in it.                | The JWT token must be stored in the cookies                                                                |                                                                                                                                        |
| isAuthenticated | A String **a path** or the actual function **require("path_to_function")**    | `path.join(__dirname, ".", "isAuth.js")` <br />or <br /> `require(path.join(__dirname, ".", "isAuth.js"))` | This function allows to validate is the user is connected, ** You must provide this function, by default there is no implementation ** |

### redis

| Key      | Value          | Description              |
| -------- | -------------- | ------------------------ |
| host     | Redis Host     | By default: 127.0.0.1    |
| port     | Redis Port     | By default : 6379        |
| password | Redis Password | By default : no password |

### namespaces

| Key                                                                    | Value                                                                                                                                                               | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Namespace name (for example : "authentication", "default", "whatever") | An array that contains the paths to the actions                                                                                                                     | /the_actions_directory/user/{find.js, findOne.js, create.js, update.js, remove.js} <br /><br />Using this path: ‘/absolute_path/user’ in the array, will automatically load the 5 actions using the same format: ‘findUser’ , ‘findOneUser’, ‘createUser.’, ‘updateUser’, ‘removeUser’ <br /><br />Using this path: ‘/absolute_path/user/find.js’ in the array, will automatically and only add ‘findUser’. <br /> the namespace named ‘default’ is this one : '/', all other namespaces are named like that : ‘/namespace_name’ |
| recursionAllowed                                                       | This option allows to scan the children directories and to automatically add the actions found in those                                                             | /user/{find.js, findOne.js, create.js, update.js, remove.js} <br/> and <br />/user/profile/{find.js, findOne.js, create.js, update.js, remove.js} <br /><br />using this directory : ‘/absolute_path/user’, will automatically add the actions within the ‘profile’ directory, then they will be named like that : ‘findUserProfile’                                                                                                                                                                                             |
| ignoreFirstDirectory                                                   | It allows to add all actions using the top level path (`/my_project/actions`), but it will remove the parent directory name (`actions`) to keep something coherent. | /actions/user/{find.js, findOne.js, create.js, update.js, remove.js} <br/> and <br />/actions/user/profile/{find.js, findOne.js, create.js, update.js, remove.js} <br /><br />, If this option is set to **FALSE**, it will return names like ‘findActionsUser’, but by enabling this option the name will be ‘findUser’ and 'findUserProfile’, ...                                                                                                                                                                              |

The available options:

```javascript
const opts = {
  authentication: {
    namespaces: ["profile", "default"],
    accessTokenKey: "accessToken", // The cookie key name
    isAuthenticated: require(path.join(__dirname, ".", "isAuth.js")), // the function to check if the user if authenticated
  },
  redis: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || "6379",
    password: process.env.REDIS_PASSWORD || "",
  },
  recursionAllowed: false, // To allow the recursion within directory within the actions directories.
  ignoreFirstDirectory: false, // To keep the user, message, etc. in the event name
  namespaces: {
    default: [
      path.join(__dirname, "actions", "user"),
      path.join(__dirname, "actions", "message"),
      path.join(__dirname, "actions", "_ReservedEvents"),
    ],
    profile: [
      path.join(__dirname, "actions", "profile"),
      path.join(__dirname, "actions", "profile", "private", "superPrivate"), // With the recursionAllowed set to 'false' you can specify specific path within a path
      path.join(__dirname, "actions", "profile", "private"), // With the recursionAllowed set to 'false' you can specify specific path within a path
    ],
    general: [path.join(__dirname, "actions", "message", "find.js")], // to attach a specific function
  },
};
```

### Functions

#### constructor(opts, app, log = console)

Initialize the socket (io), it requires an **_HTTP/HTTPS server_** or an **_Express instance_**

> Documentation to use HTTP/HTTPS : https://socket.io/docs/#Using-with-Node-http-server  
> Documentation to use Express : https://socket.io/docs/#Using-with-Express

```javascript
const app = // express or HTTP/HTTPS server //

const WebuxSocket = require("@studiowebux/socket");
const webuxSocket = new WebuxSocket(opts, app, console);
```

The `app` parameter must be set to a HTTP/HTTPS server or an Express Instance  
The `log` parameter allows to use a custom logger, by default this is set to `console`.

#### AddRedis(): Void

- It allows to add a redis connection to keep the client connections while using a cluster.
- Redis is configured “automatically” based on the coniguration.
- If no configuration is defined, the default behavior will be `127.0.0.1:6379` without password.

**Run your Redis instance with Docker**

```bash
docker run --rm --name redis -p 6379:6379 redis
```

To use this function :

```javascript
webuxSocket.AddRedis();
```

You can easily configure a cluster to get load balancing and redondancy for your backends using this function.

#### AddAuthentication(): Callback(error, user)

- It allows to add an authentication to check if the user is connected before establishing the connection with the socket.
- The authentication can be configured per namespace, the configuration allows to secure specific namespaces easily or the whole application by specifying the 'default' namespace.

> For more details, [io.use](https://socket.io/docs/migrating-from-0-9/#Socket-io-uses-middleware-now)

The authentication functon must be provided by you, you can link the function using the path or the actual function (with require())

If the user isn't connected, the backend will return an error and the connection will not be established.

> The error is returned on `gotErreur`

To use the function:

```javascript
webuxSocket.AddAuthentication();
```

#### Start(): Void

This function allows to

1. Start the socket.IO instance
2. Automatically configure the actions and namespaces based on the configuration file/variable

```bash
webuxSocket.Start();
```

> If the automatic configuration doesn't meet your requirements, you can use the `Standalone()` function to access the native socket.IO implementation.

#### Initialize(server): Object

This function initializes the socket.io instance using a server and it returns a io instance.

```javascript
const app = require("express")();
const server = require("http").Server(app);
// OR
const app = require("http").createServer(handler); // handler not defined here ...

const io = webuxSocket.Initialize(server);
```

#### Standalone(): Object

This function allows to

1. Return the Socket.IO instance
2. Still possible to use the Redis and Authentication function

This function let you use this module along with the native implementation of Socket.IO

To get more information about Socket.IO, please consult the official documentation [Socket.IO Documentation](https://socket.io/docs/)

```javascript
// Using default namespace
webuxSocket.Standalone().on("connection", (socket) => {
  console.debug(`webux-socket - Socket ${socket.id} connected.`);

  socket.on("disconnect", () => {
    console.debug(`webux-socket - Socket ${socket.id} disconnected.`);
  });

  socket.emit("userFound", [1, 2, 3, 4, 5]);
});

// Using namespace
webuxSocket
  .Standalone()
  .of("/profile")
  .on("connection", (socket) => {
    console.debug(`webux-socket - Socket ${socket.id} connected.`);

    socket.on("disconnect", () => {
      console.debug(`webux-socket - Socket ${socket.id} disconnected.`);
    });

    socket.emit("profileFound", [5, 4, 3, 2, 1, 0]);
  });
```

## Quick Start

### How to use the reserved events

How to do something like that `socket.on('disconnect', (socket)=>{})` and others.

Here is the list of reserved keywords:

```javascript
"error",
"connect",
"disconnect",
"disconnecting",
"newListener",
"removeListener",
"ping",
"pong";
```

#### Events usage

You must create a directory named '\_ReservedEvents', then add the event files like that :

```bash
./actions/
  ./_ReservedEvents
    disconnect.js
    connect.js
    etc...
  ./user
    ...
  ./message
    ...
```

Then in the configuration file,

```javascript
const opts = {
  recursionAllowed: true, // can be true or false for this example
  ignoreFirstDirectory: false, // must be set to false for this example
  namespaces: {
    default: [
      path.join(__dirname, "actions", "user"),
      path.join(__dirname, "actions", "message"),
      path.join(__dirname, "actions", "_ReservedEvents"), // It will load the events
    ],
  },
};
```

That way the default namespace will have a listener on the `disconnect` and `connect` events.  
You can use the same pattern to create custom events per namespaces, or simply reuse the events in multiple namespaces.

> That means that you can create multiple folders named `\_ReservedEvents` and link each of them per namespaces.

and/or

> Use the same directory to all namespaces

#### Examples

**\_ReservedEvents/disconnect.js**

```javascript
const socket = (client, io) => {
  return () => {
    console.debug(`Socket ${client.id} disconnected.`);
  };
};

module.exports = { socket };
```

**\_ReservedEvents/connect.js**

> This function doesn't need the `return (){ ... }` like the disconnect event

```javascript
const socket = (client, io) => {
  console.debug(`Socket ${client.id} connected.`);
};

module.exports = { socket };
```

### The function to check the authentication

This function must be adapted to your project, here is an example with JWT,

1. Create a file named `isAuth.js`

```javascript
"use strict";

const jwt = require("jsonwebtoken");

function isAuth(accessToken) {
  return new Promise((resolve, reject) => {
    jwt.verify(accessToken, "HARDCODED_JWT_SECRET", (err, user) => {
      if (err || !user) {
        return reject(err || new Error("No user found"));
      }
      return resolve(user);
    });
  });
}

module.exports = isAuth;
```

2. update the `isAuthenticated` key in the configuration,
   > You can use the path to the function or use the require("path_to_the_function") directly,

```javascript
const opts = {
  authentication: {
    namespaces: ["profile", "default"],
    accessTokenKey: "accessToken", // The cookie key name
    isAuthenticated: require(path.join(__dirname, ".", "isAuth.js")), // the function to check if the user if authenticated (OR -> isAuthenticated: path.join(__dirname, ".", "isAuth.js"))
  },
};
```

What to remember when creating this function:

1. Must return a _promise_
2. Must return an _object_ with the _user payload_ when _Success_
3. Must return a _new Error()_ in case of _Failure_

### The Action File

This file must have a specific structure to be implemented with the `Start()` function

#### user/find.js

```javascript
// helper
const timeout = (ms) => new Promise((res) => setTimeout(res, ms));

// action
// Application Logic
const find = (body) => {
  return new Promise(async (resolve, reject) => {
    console.log(body);
    console.log("Start retrieving entries");
    console.log("then wait 2 seconds");
    await timeout(2000);
    return resolve({ msg: "Success !", users: ["1", "2", "3", "4", "5"] });
  });
};

// route
// For REST API
const route = async (req, res, next) => {
  try {
    const obj = await find(req.body);
    if (!obj) {
      return next(new Error("No user found."));
    }
    return res.status(201).json(obj);
  } catch (e) {
    next(e);
  }
};

// socket
// socket.on("eventName", (body,fn){})
const socket = (socket, io) => {
  return async (body, fn) => {
    try {
      const obj = await find(body).catch((e) => {
        throw e;
      });
      if (!obj) {
        throw new Error("No user found");
      }
      fn(true); // Returns a callback

      socket.emit("userFound", obj); // to only the client
      //io.emit("userFound", obj); // to everyone
    } catch (e) {
      socket.emit("gotError", e.message);
    }
  };
};

module.exports = {
  find,
  route,
  socket,
};
```

The _action_ file is separated in 3 sections

- _Controller / Action / Module / Logic / Whatever_  
  This section allows to do some stuffs with the database, an operation with the data or more. This is the application logic.
- _Route_  
  This section allows to use a REST API Call
  > (This section doesn't apply to this module, this is used for the REST API, if you only use the Socket.IO implementation, you can safely remove it)
- _Socket_  
  This section allows to return the function use by `socket.on`

The _socket_ and _io_ parameters are automatically passed using the function `Start()`  
The _body_ and _fn_ paramters are available to configure the function as needed.

### Callbacks (Acknowledgements)

This is possible to return a callback, you have to use the last parameter like in the example above (the _fn_),  
For more details : [Acknowledgements](https://socket.io/docs/#Sending-and-getting-data-acknowledgements)

### Emits

The information is available here : [Emit Cheatsheet](https://socket.io/docs/emit-cheatsheet/)

### Rooms

The information is available here : [Rooms and namespaces](https://socket.io/docs/rooms-and-namespaces/)

## Videos and other resources

## Contribution

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## license

SEE LICENSE IN license.txt
