## Introduction

This module starts an HTTP or HTTPS server.

It requires an `expressJS` application or an `handler` function to launch the server.

This is possible to use an HTTP or an HTTPS server, but not both in same time.

To redirect the traffic from HTTP to HTTPS, this is recommended to use a proxy (Nginx, HAProxy and others)

For more details (EN/FR) : [Wiki](https://github.com/studiowebux/webux-server/wiki)

## Installation

```bash
npm install --save @studiowebux/server
```

[NPM](https://www.npmjs.com/package/@studiowebux/server)

## Usage

### Configuration

#### Options

| Key        | Value                                               | Description                                                                                                      |
| ---------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| ssl        | `{ enabled: false, key: "base64", cert: "base64" }` | To enable and configure the HTTPS                                                                                |
| enterprise | Enterprise name                                     |                                                                                                                  |
| author     | Your name                                           |                                                                                                                  |
| project    | Your project name                                   | The NPM project name                                                                                             |
| version    | The version of your backend                         | `require("./package.json")["version"]` allows to use the version in `package.json` file directly                 |
| endpoint   | The base URL to access the backend                  | Don't forget to configure the proxy server with this information                                                 |
| port       | The port to listen on                               | If the port is already used, the server will throw an error. <br /> Using the port **0** will use a random port. |
| cores      | Number of cores to use when using the cluster mode. | If this value is undefined, all available cores will be use.                                                     |

The available options:

```javascript
const options = {
  ssl: {
    enabled: false,
    key: "base64",
    cert: "base64",
  },
  enterprise: "Studio Webux S.E.N.C",
  author: "Tommy Gingras",
  project: "@studiowebux/bin",
  version: require("./package.json")["version"],
  endpoint: "/api/v1",
  port: 1337,
  cores: 4,
};
```

## Functions

### constructor(opts, app, log = console)

It initializes the server based on the configuration.

```javascript
const WebuxServer = require("@studiowebux/server");

const webuxServer = new WebuxServer(opts, app, console);
```

> The `log` parameter allows to use a custom logger function.

> The `app` parameter must be an `ExpressJS` or an `handler` function (See below for more details).

### StartServer(): Promise \<Object\>

This function starts only one process for the application.  
It means that only one core will be use on the system.  
To know the difference, please read this : [NodeJS Cluster](https://nodejs.org/api/cluster.html)

```javascript
const instance = await webuxServer.StartServer();
```

### StartCluster(): Promise \<Object\>

This function starts multiple processes based on the number of cores defined in the configuration (or all cores if undefined).  
The technology used for that is [NodeJS Cluster](https://nodejs.org/api/cluster.html)

> If the key `cores` is undefined, all cores will be used.

```javascript
const instance = await webuxServer.StartCluster();
```

The first instance returned is the actual cluster (returned by the master), that means that to use the functions from the HTTP/HTTPS server, you have to do a condition,

Example:

```javascript
// Start the cluster
webuxServer.StartCluster().then((instance) => {
  if (instance && !instance.isMaster) {
    // For example, to stop the HTTP/HTTPS server;
    // right after the creation (this is useless ..)
    instance.close();
  }
});
```

> The `cluster.js` file within the `examples` directory contains some functions to show the idea.

## Quick start

> The `/examples` directory has multiple demos and resources.

### How to create an HTTP server with Express

#### Step 1 - The configuration

config/server.js

```javascript
module.exports = {
  enterprise: "Example Inc.",
  author: "Example",
  project: "example",
  version: require("./package.json")["version"],
  endpoint: "/api/v1",
  port: 1337,
};
```

#### Step 2 - The server file with express routing

index.js

```javascript
const WebuxServer = require("@studiowebux/server");
const express = require("express");
const app = express();
const options = require("config/server.js");
const webuxServer = new WebuxServer(options, app, console);

app.set("node_env", process.env.NODE_ENV || "development");
app.set("port", process.env.PORT || 1337);

app.get("*", (req, res, next) => {
  console.log(`New Request`);
  return next();
});

app.get("/", (req, res, next) => {
  res.status(200).json({ message: "Something Fun !" });
});

webuxServer.StartServer();
// OR to use the cluster implementation
// webuxServer.StartCluster();
```

### How to create an HTTPS server with Express

#### Step 1 - The certificates

To generate a self-signed certificate:

> This is highly recommended to use real certificate,  
>  this example should only be used in test and development.

```bash
openssl req -new -newkey rsa:4096 -x509 -sha256 -days 365 -nodes -out  cert.crt -keyout key.key
```

To convert the `certificate` and the `key` in `base64` format:

```bash
cat key.key | base64
cat cert.crt | base64
```

To add those in the environment variables:

```bash
export KEY=...
export CERT=...
```

#### Step 2 - The configuration

config/server.js

```javascript
module.exports = {
  ssl: {
    enabled: process.env.KEY && process.env.CERT ? true : false,
    key: process.env.KEY,
    cert: process.env.CERT,
  },
  enterprise: "Example Inc.",
  author: "Example",
  project: "example",
  version: require("./package.json")["version"],
  endpoint: "/api/v1",
  port: 1337,
};
```

#### Step 3 - The server file with express routing

index.js

```javascript
const WebuxServer = require("@studiowebux/server");
const express = require("express");
const app = express();
const options = require("config/server.js");
const webuxServer = new WebuxServer(options, app, console);

app.set("node_env", process.env.NODE_ENV || "development");
app.set("port", process.env.PORT || 1337);

app.get("*", (req, res, next) => {
  console.log(`New Request`);
  return next();
});

app.get("/", (req, res, next) => {
  res.status(200).json({ message: "Something Fun !" });
});

webuxServer.StartServer();
// OR to use the cluster implementation
// webuxServer.StartCluster();
```

### How to create a server without Express

#### Step 1 - The `handler` function

index.js

```javascript
function handler(req, res) {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("Hello World!");
  res.end();
}
```

Official documentation: [NodeJS HTTP](https://nodejs.org/en/knowledge/HTTP/servers/how-to-create-a-HTTP-server/)

#### Step 2 - The configuration

config/server.js

```javascript
module.exports = {
  enterprise: "Example Inc.",
  author: "Example",
  project: "example",
  version: require("./package.json")["version"],
  endpoint: "/api/v1",
  port: 1337,
  cores: 4, // Optional, used with StartCluster()
};
```

#### Step 3 - The server file with the handler

index.js

```javascript
const WebuxServer = require("@studiowebux/server");
const handler = require("handler.js");
const options = require("config/server.js");
const webuxServer = new WebuxServer(options, handler, console);

webuxServer.StartServer();
// OR to use the cluster implementation
// webuxServer.StartCluster();
```

## The server events

[NodeJS events](https://nodejs.org/api/http.html#http_class_http_server)

By default, these events are implemented

- error
- close
- listening

They print messages to keep traces of what happened.

To use the events, you can do something like:

Both `StartServer` & `StartCluster` are configured the same way:

```javascript
const WebuxServer = require("@studiowebux/server");
const handler = require("handler.js");
const options = require("config/server.js");
const webuxServer = new WebuxServer(options, handler, console);

webuxServer.StartServer();
// webuxServer.StartCluster();

webuxServer.server.on("connection", (req) => {
  console.log(req);
  //
});
```

## Videos and other resources

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

SEE LICENSE IN license.txt
