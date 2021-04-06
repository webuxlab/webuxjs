# Introduction

Ce module couvre plusieurs fonctionnalités:

1. Charger les configurations se trouvant dans un répertoire et les rendre disponibles globalement
2. Gestion des erreurs
3. Traduction directement sur le backend
4. Convertir les ID en URL
5. Retourner L'adresse IP du client
6. Convertir les array Mongo en objet
7. Charger les modules et autres dans des variables globales.

> Ce module est conçu pour être utilisé comme étant la base de l'application.

# Installation

```bash
npm install --save @studiowebux/app
```

[npm @studiowebux/app](https://www.npmjs.com/package/@studiowebux/app)

# Usage

# Configuration

| Key           | Value                                                                   | Description | plus d'info |
| ------------- | ----------------------------------------------------------------------- | ----------- | ----------- |
| configuration | Un chemin absolu vers le répertoire contenant toutes les configurations |             |

Exemple:

```javascript
const opts = {
  configuration: path.join(__dirname, "..", "config"),
};
```

## Fonctions

### constructor(opts, log = console)

Initialiser la variable config,

```javascript
const WebuxApp = require("@studiowebux/app");

let webuxApp = new WebuxApp(
  {
    configuration: path.join(__dirname, "..", "config"),
  },
  console
);
```

Le paramètre `opts` est optionnel, vous pouvez utiliser ce module sans charger toutes les configurations globalement.

### LoadConfiguration(): Object

Pour charger les configurations en utilisant le répertoire utilisé lors de l'initialisation,

```javascript
const WebuxApp = require("../src/index");
const path = require("path");
const options = {
  configuration: path.join(__dirname, "config"),
};

const webuxApp = new WebuxApp(options);

webuxApp.LoadConfiguration();
```

Il est aussi possible d'ajouter des configurations manuellement,

```javascript
webuxApp.config._manual = {
  testing: "test1",
};
```

La fonction `LoadConfiguration` ajoute les configurations, c'est-à-dire que les configurations ajoutées manuellement ne seront pas supprimées si cette fonction est appelée suite aux changements.

### LoadModule(modulePath, key): Object

Cette fonction charge dans une variable tous les modules d'un fichier,
Par exemple, si vous voulez charger toutes les fonctions **helpers** sous `webuxApp.helpers.*`

Vous pouvez faire comme suit,

Exemple complet:

```javascript
webuxApp.LoadModule(
  path.join(__dirname, "api", "v1", "constants"),
  "constants"
);
webuxApp.LoadModule(
  path.join(__dirname, "api", "v1", "validations"),
  "validations"
);
webuxApp.LoadModule(path.join(__dirname, "api", "v1", "helpers"), "helpers");
webuxApp.LoadModule(
  path.join(__dirname, "api", "v1", "middlewares"),
  "middlewares"
);

console.log(webuxApp.constants);
console.log(webuxApp.helpers);
console.log(webuxApp.middlewares);
console.log(webuxApp.validations);
```

Les fichiers doivent avoir une structure comme celle-ci:

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

De cette manière la liste d'usager est accessible `webuxApp.helpers.user.users` et pour charger les usagers la fonction `GetUsers()` peut être appelée de la même façon `webuxApp.helpers.user.GetUsers()`

Le paramètre `modulePath` est obligatoire, la valeur de celui est le répertoire absolu contenant les modules à importer.
Le paramètre `key` est obligatoire, la valeur de celui est le nom de la variable qui stockera les modules.

### IdToURL(id, resource, endpoint): String

Cette fonction retourne une URL à partir des informations passées en paramètre,

Par exemple,  
un usager avec un id: **346** et vous voulez obtenir une route pour faire un **GET**

```javascript
const WebuxApp = require("@studiowebux/app");
const webuxApp = new WebuxApp();

const URL = webuxApp.IdToURL(346, "user", "https://webuxlab.com/api/v1");
```

Le résultat : `https://webuxlab.com/api/v1/user/346`

Le paramètre `id` est obligatoire, la valeur de celui est l'identifiant de la ressource.
Le paramètre `resource` est obligatoire, la valeur de celui est le nom de la resource pour lui accéder avec une requête REST API.
Le paramètre `endpoint` est optionnel (par défaut, la variable `config.server.endpoint` est utilisée), la valeur de celui est le préfix pour créer une URL.

### ToObject(array): Object

Cette fonction convertit une liste de résultat en object

```javascript
let users = [
  { _id: "12345abc22...", name: "test" },
  { _id: "12345abc23...", name: "test2" },
  { _id: "12345abc24...", name: "test3" },
];
console.log(webuxApp.ToObject(users));
```

Le résultat:

```bash
{
  '12345abc22...': { _id: '12345abc22...', name: 'test' },
  '12345abc23...': { _id: '12345abc23...', name: 'test2' },
  '12345abc24...': { _id: '12345abc24...', name: 'test3' }
}
```

Le paramètre `array` est obligatoire, la valeur doit être un array contenant des objets, puis ceux-ci doivent contenir `_id` pour effectuer le mapping correctement.

### ConfigureLanguage(): Object

Cette fonction configure le i18n, ce module utilise directement celui disponible sur NPM  
[i18n](https://www.npmjs.com/package/i18n)

Cette fonction retourne l'object i18n configuré. De plus, il est disponible en utilisant `webuxApp.i18n`

Il est nécessaire de passer une configuration,

> Pour toutes les options disponibles, voir la documentation officielle du module.

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

Exemple,

Sans charger les modules automatiquement,

index.js

```javascript
const WebuxApp = require("@studiowebux/app");
const webuxApp = new WebuxApp();

// To configure the i18n
webuxApp.config.language = language;

const i18n = webuxApp.ConfigureLanguage();
```

Avec les configurations chargées automatiquement,
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

### I18nOnRequest(): Function

Cette fonction permet d'ajouter le module i18n directement dans les routes d’express.  
Pour plus de détails, veuillez consulter la documentation officielle : [i18n](https://www.npmjs.com/package/i18n)

Cette fonction est utilisée, avec `app.use()` d’express.

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

Comme montre l'exemple, il est possible d'utiliser le module de trois manières,

1. webuxApp.i18n.\*
2. i18n.\*
3. res.\_\_()

### GetIP(request): String

Cette fonction tente de détecter l'adresse IP du client qui effectue une requête sur le backend.

Les paramètres qui sont vérifiés,

```javascript
req.headers["x-forwarded-for"] ||
  req.connection.remoteAddress ||
  req.socket.remoteAddress ||
  (req.connection.socket ? req.connection.socket.remoteAddress : null);
```

Si l'adresse n'est pas détectée, la fonction retourne `null`

Le paramètre `request` est obligatoire, la valeur de celui-ci est celle de l'objet response d’express.

par exemple,

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

### ErrorHandler(code, msg, extra, devMsg): Error

Cette fonction permet de standardiser les messages d'erreur et de les formater pour faciliter la gestion de ceux-ci,

Voici un exemple,

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

Accéder à la route `/error` va automatiquement retourner une erreur **400** avec le message **Bad Request**, puis un objet personnalisé et un message pour les développeurs.

Le paramètre `code` est optionnel (_par défaut, 500_), le code HTTP de l'erreur.
Le paramètre `msg` est optionnel, un message pour informer l'usager de l'erreur.
Le paramètre `extra` est optionnel, un objet contenant des informations supplémentaires.
Le paramètre `devMsg` est optionnel, un message pour faciliter le debug.

### GlobalErrorHandler(): Function

Permets d'intercepter toutes les erreurs lancées par la fonction `ErrorHandler()`  
Pour utiliser cette fonction, vous devez l'ajouter à la toute fin de la définition des routes.

Cette fonction est utilisée, avec `app.use()` d’express.

Par exemple,

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

### NotFoundErrorHandler(): Function

Permets d'intercepter les routes qui ne sont pas trouvées.  
Pour utiliser cette fonction, vous devez l'ajouter avant la fonction `GlobalErrorHandler()`, mais après la définition des routes.

Cette fonction est utilisée, avec `app.use()` d’express.

Par exemple,

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
app.use(webuxApp.NotFoundErrorHandler());
app.use(webuxApp.GlobalErrorHandler());

app.listen(1337, () => {
  console.log("Server is listening on port 1337");
});
```

Pour utiliser la traduction avec ce module,
Voici la Key : `ROUTE_NOT_FOUND`

# Démarrage rapide

## Exemple complet

### Étape 1. Création des répertoires

l'application est divisée comme suit:

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

Pour tous les détails, veuillez vous référer à l'exemple : `examples/utils/api/v1`

l'application:

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

De cette façon l'application est exportée et peut-être importée dans les autres fichiers pour gérer le tout de manière centralisée.

Le serveur:

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

En utilisant cette méthode, vous pouvez créer une application complexe en gardant le tout simple à gérer.

## Le répertoire actions

```bash
/api/v1/actions/user/
  find.js
  findOne.js
  remove.js
  update.js
  create.js
```

Ces fichiers ont une structure spécifique:

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

# Vidéos et autres ressources
