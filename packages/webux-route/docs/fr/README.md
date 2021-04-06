# Introduction

Ce module permet trois choses :

1. Charger les routes express automatiquement en utilisant une configuration JSON
2. Charger les routes statiques automatiquement en utilisant une configuration JSON
3. Ajouter des réponses express personnalisées.

> Ce module est conçu pour être utilisé avec express.

# Installation

```bash
npm install --save @studiowebux/route
```

[npm @studiowebux/route](https://www.npmjs.com/package/@studiowebux/route)

# Usage

# Configuration

| Key       | Value                                                                                                       | Description | Plus d’info |
| --------- | ----------------------------------------------------------------------------------------------------------- | ----------- | ----------- |
| routes    | Un objet contenant la définition des routes API, voir plus bas pour la structure.                           |             |             |
| resources | Un objet contenant la définition des routes pour les ressources statiques, voir plus bas pour la structure. |             |             |

Les options disponibles:

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

## Fonctions

### constructor(opts, log = console)

Permets d'initialiser les configurations.

```javascript
const WebuxRoute = require("@studiowebux/route");
const webuxRoute = new WebuxRoute(opts, console);
```

Le paramètre `opts` est optionnel, c'est-à-dire qu'il est possible de passer directement en paramètre les options pour les fonctions `LoadRoute` & `LoadStatic`.

Le paramètre `log` permet d'utiliser un logger personnalisé. Par défaut, il est configuré sur la console.

### LoadRoute(router, routes = null): Promise

Pour charger les routes API automatiquement en utilisant une configuration JSON.  
Pour utiliser la fonction,

Avec la configuration du module,

```javascript
const express = require("express");
const app = express();
const router = express.Router();

webuxRoute.LoadRoute(router);

app.use("/", router);
```

Avec l'option passée en paramètre,

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
    };


webuxRoute.LoadRoute(router, routes);
app.use("/", router);
```

Le paramètre `routes` est seulement utilisé lorsque la configuration de la route est personnalisée. Cette méthode permet d'utiliser plusieurs configurations et une globale.
Le paramètre `router` provient d’express.

### LoadStatic(app, express, resources = null): Promise

Pour charger les routes pour les ressources statiques automatiquement en utilisant une configuration JSON.  
Pour utiliser la fonction,

Avec la configuration du module,

```javascript
const express = require("express");
const app = express();

webuxRoute.LoadStatic(app, express);
```

Avec l'option passée en paramètre,

```javascript
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

le paramètre `resources` est seulement utilisé lorsque la configuration de la route est personnalisée. Cette méthode permet d'utiliser plusieurs configurations et une globale.
Les paramètres `app` & `express` proviennent d’express.

### LoadResponse(app): Void

Cette fonction permet de charger les réponses personnalisées avec Express,

```javascript
const express = require("express");
const app = express();

webuxRoute.LoadResponse(app);
```

#### Les réponses personnalisées (res)

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

# Démarrage rapide

## Exemple complet

### Étape 1. Création des dossiers

| Répertoire | Description                                                                                     |
| ---------- | ----------------------------------------------------------------------------------------------- |
| actions/\* | La logique de l'application (Voir le répertoire `example/actions` pour toutes les possibilités) |
| images     | Un répertoire qui contient des images pouvant être envoyées aux clients                         |
| public     | Un répertoire contenant les fichiers publics accessibles aux clients                            |
| config.js  | La structure JSON pour les routes et resources                                                  |
| index.js   | Le fichier contenant le serveur                                                                 |

### Étape 2. Exemple d'une action

actions/user/find.js

```javascript
const route = async (req, res, next) => {
  return res.success({ msg: "Find User", user: { fullname: "John Doe" } });
};

module.exports = { route };
```

### Étape 3. La configuration

config.js

```javascript
const path = require("path");

// Include the middlewares somehow...
const isAuthenticated = () => {
  return (req, res, next) => {
    console.log("The user must be authenticated to do this...");
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

### Étape 4. Le fichier du serveur

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

  // must be run at the end.
  await webuxRoute.LoadStatic(app, express);

  app.listen(1337, () => {
    console.log("Server is listening on port 1337");
  });
})();
```

# Vidéos et autres ressources
