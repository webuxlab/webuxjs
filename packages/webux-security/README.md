## Introduction

This module offers these features:

1. Query parser (req.query), `initially made to work with Mongoose`
2. Express Rate Limiter
3. joi validators
4. body parser
5. cookie parser
6. cors
7. Response Headers
8. helmet
9. compression
10. x-powered-by
11. trust proxy

> This module is built to be use with Express.

## Installation

```bash
npm install --save @studiowebux/security
```

[npm @studiowebux/security](https://www.npmjs.com/package/@studiowebux/security)

## Usage

## Configuration

| Key          | Value                                                       | Description                  | More info                                          |
| ------------ | ----------------------------------------------------------- | ---------------------------- | -------------------------------------------------- |
| bodyParser   | `limit` and `extended`                                      |                              | https://www.npmjs.com/package/body-parser          |
| cookieParser | `secret`                                                    |                              | https://www.npmjs.com/package/cookie-parser        |
| cors         | `whitelist` the array of URLs authorized                    | Use `[]` to disable the cors | https://www.npmjs.com/package/cors                 |
| server       | See below, The response headers and the proxy configuration |                              |                                                    |
| rateLimiters | See below, An array of objects                              |                              | https://www.npmjs.com/package/express-rate-limiter |

Example:

```javascript
const opts = {
  bodyParser: {
    limit: "1mb",
    extended: false,
  },
  cookieParser: {
    secret: process.env.COOKIE_SECRET || "CookieSecret",
  },
  cors: {
    whitelist: ["https://webuxlab.com", "http://127.0.0.1"], // or [] to disable cors
  },
  server: {
    trustProxy: true,
    allowedMethods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    allowedCredentials: false,
    allowedHeaders:
      "Origin, X-Requested-with, Accept, Authorization, Content-Type, Accept-Language",
  },
  rateLimiters: [
    {
      name: "Authentication",
      time: 3600, // blocked for 1 hour
      maxReq: 3, // after 3 tries
      pattern: "/auth", // The route prefix to apply this limiter
    },
    {
      name: "Global",
      time: 60, // blocked for 1 minute
      maxReq: 5, // after 5 tries the requester will be blocked for 1 minute
      pattern: "", // It applies globally
    },
  ],
};
```

### Functions

#### constructor(opts, log = console)

Initialize the configurations globally.

```javascript
const WebuxSecurity = require("@studiowebux/security");
const Security = new WebuxSecurity(opts, console);
```

The `opts` parameter is mandatory, it configures the security module.

The `log` parameter allows to use a custom logger, by default it uses the console.

#### validators

This property has all `joi` based validators attached.  
To access a validator, `Security.validators.Body(...)`

##### How to use a validator (Schema Definition)

For more information, please read the official `joi` [documentation](https://hapi.dev/module/joi/),

###### Examples

**Schemas**

```javascript
const Joi = require("joi");

const Create = Joi.object()
  .keys({
    user: {
      username: Joi.string().required(),
      premium: Joi.boolean().required(),
    },
  })
  .required();

const Update = Joi.object({
  user: {
    premium: Joi.boolean().required(),
  },
}).required();

const ID = Joi.string()
  .pattern(/^[0-9]*$/)
  .required();

const Something = Joi.object({
  items: Joi.array().required(),
}).required();
```

**Usage**

```javascript
app.post("/something", async (req, res) => {
  await Security.validators
    .Custom(Something, req.body)
    .then((value) => {
      return res.status(200).json({ msg: "Bonjour !" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(400).json({ msg: "BAD_REQUEST", reason: err.message });
    });
});

app.post(
  "/account/:id",
  Security.validators.Id(ID),
  Security.validators.Body(Update),
  (req, res) => {
    console.info("Hello World !");
    return res.status(200).json({ msg: "Bonjour !" });
  }
);
```

##### List of validators

> Where the `...` is the Joi validator code.
> These functions will return nothing if the data is valid.
> Or a structured error using the `errorHandler` function.

###### Body (req.body, errorHandler = Handler)

`Body(Schema)(req, res, next)=>{...};`

###### Id (req.params.id, errorHandler = Handler)

`Id(Schema)(req, res, next)=>{...};`

###### MongoID (req.params.id, errorHandler = Handler)

`MongoID(Schema)(req, res, next)=>{...};`

###### MongoIdOrURL (req.params.id_url, errorHandler = Handler)

`MongoIdOrURL(Schema)(req, res, next)=>{...};`

###### User (req.user, errorHandler = Handler)

`User(Schema)(req, res, next)=>{...};`

###### Headers (req.headers, errorHandler = Handler)

`Headers(Schema)(req, res, next)=>{...};`

###### Files (req.files, errorHandler = Handler)

`Files(Schema)(req, res, next)=>{...};`

###### Custom (object, errorHandler = Handler)

`Custom(Schema, object);`

##### Default errorHandler Function

> You can override this function,

```javascript
(code, msg, extra, devMsg) => {
  let error = new Error();

  error.code = code || 500;
  error.message = msg || "";
  error.extra = extra || {};
  error.devMessage = devMsg || "";

  return error;
};
```

#### SetResponseHeader(app): Void

It loads the response headers using the `res.header(...)`

```javascript
const express = require("express");
const app = express();

Security.SetResponseHeader(app);
```

The `app` parameter is mandatory, it is used to configure the headers.

#### SetGlobal(app): Void

It configures:

- The `compression`
- The `trust proxy`
- `Helmet`
- The `x-powered-by`

```javascript
const express = require("express");
const app = express();

Security.SetGlobal(app);
```

The `app` parameter is mandatory, it is used to configure the modules.

#### SetBodyParser(app): Void

It configures the body parser.

```javascript
const express = require("express");
const app = express();

Security.SetBodyParser(app);
```

The `app` parameter is mandatory, it is used to configure the modules.

#### SetCookieParser(app): Void

It configures the cookie parser.

```javascript
const express = require("express");
const app = express();

Security.SetCookieParser(app);
```

The `app` parameter is mandatory, it is used to configure the modules.

#### SetCors(app): Void

It configures the cors.

> To disable all cors, in the option, specify : `[]`

```javascript
const express = require("express");
const app = express();

Security.SetCors(app);
```

The `app` parameter is mandatory, it is used to configure the modules.

#### CreateRateLimiters(app): Void

It configures the rate limiters

```javascript
const express = require("express");
const app = express();

Security.CreateRateLimiters(app);
```

The `app` parameter is mandatory, it is used to configure the modules.

#### QueryParser(blacklist = [], defaultSelect = "", errorHandler = null): Void

This method is `static`
It parses the `req.query`, if there is blacklisted word present, it will return an error.  
Otherwise, the idea behind this function is to facilitate the query with MongoDB.  
But it can be use to parse the query only.

```javascript
let blacklist_fields = ["password", "birthday", "phoneNumber"];
let defaultSelect = "username, email, fullname";

Security.QueryParser(blacklist_fields, defaultSelect);
```

The `blacklist` parameter is optional
The `defaultSelect` parameter is optional
The `errorHandler` parameter is optional (it uses the default one by default)

##### Example

Using this code and this request, returns

```javascript
// http://localhost:1337/account?limit=5&sort=-username&skip=100
app.get(
  "/account",
  Security.QueryParser(["password"], "username premium"),
  (req, res) => {
    console.log(req.query);
    res.status(200).json({ query: req.query });
  }
);
```

Return:
_http://localhost:1337/account?limit=5&sort=-username&skip=100_

```javascript
{
    "query": {
        "filter": {},
        "limit": 5,
        "sort": [
            "-username"
        ],
        "skip": 100,
        "projection": "username premium"
    }
}
```

_http://localhost:1337/account?limit=5&sort=-username&skip=100_&filter=username eq 'bonjour'\_

```javascript
{
    "query": {
        "filter": {
            "username": {
                "$eq": "bonjour"
            }
        },
        "limit": 5,
        "sort": [
            "-username"
        ],
        "skip": null,
        "projection": "username premium"
    }
}
```

_http://localhost:1337/account?limit=5&sort=-username&skip=100&filter=password eq 'something'_

```javascript
{
    "code": 400,
    "message": "INVALID_REQUEST",
    "extra": {},
    "devMessage": "Query may contains blacklisted items."
}
```

## Quick start

### Complete example

#### Step 1. Define Configuration

options.js

```javascript
module.exports = {
  bodyParser: {
    limit: "1mb",
    extended: false,
  },
  cookieParser: {
    secret: process.env.COOKIE_SECRET || "CookieSecretNotVerySecure...",
  },
  cors: {
    whitelist: ["https://webuxlab.com", "http://127.0.0.1"], // or [] to disable cors
  },
  server: {
    trustProxy: true,
    allowedMethods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    allowedCredentials: false,
    allowedHeaders:
      "Origin, X-Requested-with, Accept, Authorization, Content-Type, Accept-Language",
  },
  rateLimiters: [
    {
      name: "Authentication",
      time: 3600, // blocked for 1 hour
      maxReq: 10, // after 10 tries
      pattern: "/auth", // The route prefix to apply this limiter
    },
    {
      name: "Global",
      time: 60, // blocked for 1 minute
      maxReq: 150, // after 5 tries the requester will be blocked for 1 minute
      pattern: "", // It applies globally
    },
  ],
};
```

#### Step 2. Create schema validators

validators.js

```javascript
const Joi = require("joi");

const Create = Joi.object()
  .keys({
    user: {
      username: Joi.string().required(),
      premium: Joi.boolean().required(),
    },
  })
  .required();

const Update = Joi.object({
  user: {
    premium: Joi.boolean().required(),
  },
}).required();

const ID = Joi.string()
  .pattern(/^[0-9]*$/)
  .required();

const Something = Joi.object({
  items: Joi.array().required(),
}).required();

module.exports = {
  Something,
  ID,
  Update,
  Create,
};
```

#### Step 5. Create app.js

app.js

```javascript
const WebuxSecurity = require("@studiowebux/security");
const express = require("express");
const app = express();

const options = require("./options");
const { Something, ID, Update, Create } = require("./validators");

module.exports = async function loadApp() {
  const Security = new WebuxSecurity(options, console);

  Security.SetResponseHeader(app);
  Security.SetBodyParser(app);
  Security.SetCookieParser(app);
  Security.SetCors(app);
  Security.SetGlobal(app);
  Security.CreateRateLimiters(app);

  app.get("/", (req, res) => {
    console.info("Hello World !");
    return res.status(200).json({ msg: "Bonjour !" });
  });

  // http://localhost:1337/account?limit=5&sort=-username&skip=100
  app.get(
    "/account",
    Security.QueryParser(["password"], "username premium"),
    (req, res) => {
      console.log(req.query);
      res.status(200).json({ query: req.query });
    }
  );

  app.post("/something", async (req, res) => {
    await Security.validators
      .Custom(Something, req.body)
      .then((value) => {
        return res.status(200).json({ msg: "Bonjour !" });
      })
      .catch((err) => {
        console.error(err);
        return res
          .status(400)
          .json({ msg: "BAD_REQUEST", reason: err.message });
      });
  });

  app.post(
    "/account/:id",
    Security.validators.Id(ID),
    Security.validators.Body(Update),
    (req, res) => {
      console.info("Hello World !");
      return res.status(200).json({ msg: "Bonjour !" });
    }
  );

  app.post("/account", Security.validators.Body(Create), (req, res) => {
    console.info("Hello World !");
    return res.status(200).json({ msg: "Bonjour !" });
  });

  app.post("/", (req, res) => {
    console.info("Hello World !");
    console.log(req.cookies);
    return res.status(200).json({ msg: "Bonjour !" });
  });

  app.use("*", (error, req, res, next) => {
    console.error(error);
    res.status(error.code || 500).json(error || "An error occured");
  });

  app.listen(1337, () => {
    console.log("Server listening on port 1337");
  });
};
```

#### Step 4. Create server.js

server.js

```javascript
const loadApp = require("./app.js");

try {
  loadApp();
} catch (e) {
  console.error(e);
  process.exit(1);
}
```

## Videos and other resources

## Contribution

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## license

SEE LICENSE IN license.txt
