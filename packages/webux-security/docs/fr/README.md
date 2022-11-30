## Introduction

Ce module offre plusieurs fonctionnalités:

1. Query parser (req.query), `Fait pour fonctionner avec Mongoose`
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

> Ce module est bâti pour fonctionner avec Express.

## Installation

```bash
npm install --save @studiowebux/security
```

[npm @studiowebux/security](https://www.npmjs.com/package/@studiowebux/security)

## Usage

## Configuration

| Key          | Value                                                           | Description                            | Plus d'info                                        |
| ------------ | --------------------------------------------------------------- | -------------------------------------- | -------------------------------------------------- |
| bodyParser   | `limit` et `extended`                                           |                                        | https://www.npmjs.com/package/body-parser          |
| cookieParser | `secret`                                                        |                                        | https://www.npmjs.com/package/cookie-parser        |
| cors         | `whitelist` une liste d'URL autorisée                           | Utiliser `[]` pour désactiver les cors | https://www.npmjs.com/package/cors                 |
| server       | Voir ci-dessous, 'response headers' et 'configuration du proxy' |                                        |                                                    |
| rateLimiters | Voir ci-dessous, 'rate limiters' une liste d'objet              |                                        | https://www.npmjs.com/package/express-rate-limiter |

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

### Fonctions

#### constructor(opts, log = console)

Initialise la configuration de l'instance.

```javascript
const WebuxSecurity = require("@studiowebux/security");
const Security = new WebuxSecurity(opts, console);
```

Le paramètre `opts` est mandatoire, il configure les options pour les modules de sécurité.

Le paramètre `log` permet d'utiliser un logger personnalisé, par défaut, il utilise la `console`.

#### validators

Cette variable contient tous les valideurs de `joi`.
Pour accéder à un valideur, `Security.validators.Body(...)`

##### Comment utiliser un valideur (Schema Definition)

Pour plus d'information, voir la documentation officielle : `joi` [documentation](https://hapi.dev/module/joi/),

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
app.post("/something", (req, res) => {
  Security.validators
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

##### Liste des valideurs

> le `...` représente le code de Joi.
> Ces fonctions retournent `void` lorsque le data est valide.
> Si une erreur est détectée, la fonction `errorHandler` retourne une erreur structurée.

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

##### La fonction errorHandler par défaut

> Vous pouvez modifier cette fonction,

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

Charger les réponses du header en utilisant : `res.header(...)`

```javascript
const express = require("express");
const app = express();

Security.SetResponseHeader(app);
```

Le paramètre `app` est mandatoire.

#### SetGlobal(app): Void

Configure:

- La fonctionnalité `compression`
- La fonctionnalité `trust proxy`
- Le module `Helmet`
- La fonctionnalité `x-powered-by`

```javascript
const express = require("express");
const app = express();

Security.SetGlobal(app);
```

Le paramètre `app` est mandatoire.

#### SetBodyParser(app): Void

Configure le `body-parser`.

```javascript
const express = require("express");
const app = express();

Security.SetBodyParser(app);
```

Le paramètre `app` est mandatoire

#### SetCookieParser(app): Void

Configure le `cookie-parser`.

```javascript
const express = require("express");
const app = express();

Security.SetCookieParser(app);
```

Le paramètre `app` est mandatoire

#### SetCors(app): Void

Configure les cors

> Pour désactiver les cors, spécifiez `[]` dans les options.

```javascript
const express = require("express");
const app = express();

Security.SetCors(app);
```

Le paramètre `app` est mandatoire

#### CreateRateLimiters(app): Void

Configurer les `rate limiters`

```javascript
const express = require("express");
const app = express();

Security.CreateRateLimiters(app);
```

Le paramètre `app` est mandatoire

#### QueryParser(blacklist = [], defaultSelect = "", errorHandler = null): Void

Cette méthode utilise le mot-clé `static`
Elle analyse le contenu passé dans `req.query`, puis si des mots sensibles sont détectés, une erreur est retournée.

> L'objectif de cette fonction est de faciliter les requêtes avec MongoDB / mongoose.

```javascript
const WebuxSecurity = require("@studiowebux/security");
let blacklist_fields = ["password", "birthday", "phoneNumber"];
let defaultSelect = "username, email, fullname";

WebuxSecurity.QueryParser(blacklist_fields, defaultSelect);
```

Le paramètre `blacklist` est optionnel
Le paramètre `defaultSelect` est optionnel
Le paramètre `errorHandler` est optionnel

##### Example

Voici quelques exemples:

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

## Démarrage rapide

### Exemple complet

#### Étape 1. Définir la configuration

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

#### Étape 2. Créer les schémas de validation

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

#### Étape 3. Créer le app.js

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

#### Étape 4. Créer le server.js

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

## Vidéos et autres ressources
