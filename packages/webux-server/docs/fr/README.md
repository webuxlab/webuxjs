# Introduction

Ce module permet de démarrer un serveur HTTP ou HTTPS.  
Une application `ExpressJS` ou une fonction `handler` est requise pour lancer ce serveur.

Il est possible de choisir le serveur HTTP ou HTTPS, mais pas les deux en même temps.  
Pour rediriger le trafic HTTP vers HTTPS, il est recommandé d'utiliser un proxy (Nginx, HAproxy, ou autres).

# Installation

```bash
npm install --save @studiowebux/server
```

[npm @studiowebux/server](https://www.npmjs.com/package/@studiowebux/server)

# Usage

## Configuration

### Options

| Key        | Value                                               | Description                                                                                                                         |
| ---------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| ssl        | `{ enabled: false, key: "base64", cert: "base64" }` | Pour activer et configurer le serveur HTTPS                                                                                         |
| enterprise | Le nom de votre entreprise                          |                                                                                                                                     |
| author     | Votre nom                                           |                                                                                                                                     |
| project    | Le nom de votre projet                              | Le nom NPM                                                                                                                          |
| version    | La version de votre backend                         | `require("./package.json")["version"]` permet d'utiliser la version directement dans le `package.json`                              |
| endpoint   | l'URL de base pour communiquer avec le backend      | Ne pas oublier de configurer le proxy selon cette URL                                                                               |
| port       | Le port à utiliser                                  | Si le port est déjà utilisé, le serveur va retourner une erreur. <br /> Utiliser le port **0** permet de choisir un port aléatoire. |
| cores      | Nombre de processus à utiliser                      | En mode Cluster, si cette valeur n'est pas définie, tous les coeurs disponibles seront utilisés.                                    |

Les options disponibles:

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

# Fonctions

## constructor(opts, app, log = console)

Le constructeur pour initialiser le serveur selon la configuration.

```javascript
const WebuxServer = require("@studiowebux/server");

const webuxServer = new WebuxServer(opts, app, console);
```

> Le paramètre `log` permet d'utiliser un logger personnalisé.

> Le paramètre `app` doit être une instance expressJS ou une fonction `handler` (Voir plus bas pour les détails).

## StartServer(): Promise \<Object\>

Cette fonction démarre un seul processus pour le serveur. C'est-à-dire que seulement un processus sera utilisé. pour comprendre la différence : [NodeJS Cluster](https://nodejs.org/api/cluster.html)

```javascript
const instance = await webuxServer.StartServer();
```

## StartCluster(): Promise \<Object\>

Cette fonction démarre un serveur par coeur passé en paramètre (`cores`). C'est-à-dire que plusieurs processus seront utilisés. La technique utilisée : [NodeJS Cluster](https://nodejs.org/api/cluster.html)

> Si le nombre de coeurs n'est pas défini, tous les coeurs disponibles seront utilisés.

```javascript
const instance = await webuxServer.StartCluster();
```

La première instance retournée est le master, pour utiliser les fonctions du serveur HTTP/HTTPS, vous devez ajouter un `if`

Voici un exemple:

```javascript
webuxServer.StartCluster().then((instance) => {
  if (instance && !instance.isMaster) {
    // Pour arrêter le serveur HTTP/HTTPS;
    // ceci prend un certain temps avant d'être appliquer
    // Les nouvelles connexions ne sont pas autorisées,
    // et les existantes doivent être détruites.
    instance.close();
  }
});
```

> Le fichier d'exemple `cluster.js` contient le code fonctionnel pour montrer l'idée.

# Démarrage rapide

> Le répertoire `examples/` contient plusieurs ressources.

## Comment créer un serveur HTTP avec Express

### Étape 1 - La configuration

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

### Étape 2 - Le fichier du serveur et les routes avec ExpressJS

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
// OU pour utiliser le cluster,
// webuxServer.StartCluster();
```

## Comment créer un serveur HTTPS avec Express

### Étape 1 - Les certificats

> Il est fortement recommandé que vous utilisiez des certificats valident et qui correspondent à vos besoins d'entreprise. Les lignes ci-dessous sont pour faire des tests et du développement.

Pour générer une clé et un certificat autosigné:

```bash
openssl req -new -newkey rsa:4096 -x509 -sha256 -days 365 -nodes -out  cert.crt -keyout key.key
```

Pour convertir le `certificat` et la `clé` en `base64`:

```bash
cat key.key | base64
cat cert.crt | base64
```

Puis pour les ajouter dans les variables d'environnement:

```bash
export KEY=...
export CERT=...
```

### Étape 2 - La configuration

config/server.js

```javascript
module.exports = {
  ssl: {
    enabled: true,
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

### Étape 3 - Le fichier du serveur et les routes avec ExpressJS

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
// OU pour utiliser le cluster,
// webuxServer.StartCluster();
```

## Comment utiliser le serveur sans Express

### Étape 1 - La fonction `handler`

index.js

```javascript
function handler(req, res) {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("Hello World!");
  res.end();
}
```

Documentation officielle: [NodeJS HTTP](https://nodejs.org/en/knowledge/HTTP/servers/how-to-create-a-HTTP-server/)

### Étape 2 - La configuration

config/server.js

```javascript
module.exports = {
  enterprise: "Example Inc.",
  author: "Example",
  project: "example",
  version: require("./package.json")["version"],
  endpoint: "/api/v1",
  port: 1337,
  cores: 4, // Optionel, utilisé avec StartCluster()
};
```

### Étape 3 - Le fichier du serveur et les routes

index.js

```javascript
const WebuxServer = require("@studiowebux/server");
const handler = require("handler.js");
const options = require("config/server.js");
const webuxServer = new WebuxServer(options, handler, console);

webuxServer.StartServer();
// OU pour utiliser le cluster,
// webuxServer.StartCluster();
```

# Les évènements

[NodeJS events](https://nodejs.org/api/http.html#http_class_http_server)

Pour utiliser les events pour le serveur, vous pouvez faire comme suit,

Serveur simple:

```javascript
const WebuxServer = require("@studiowebux/server");
const handler = require("handler.js");
const options = require("config/server.js");
const webuxServer = new WebuxServer(options, handler, console);

webuxServer.StartServer();
webuxServer.server.on("connection", (req) => {
  console.log(req);
});
```

Avec le cluster:

```javascript
const WebuxServer = require("@studiowebux/server");
const handler = require("handler.js");
const options = require("config/server.js");
const webuxServer = new WebuxServer(options, handler, console);

webuxServer.StartCluster();
webuxServer.server.on("connection", (req) => {
  console.log(req);
});
```

# Vidéos et autres ressources
