## Introduction

Ce module utilise **Morgan** et **Winston**.  
Les deux fonctionnalités implémentées:

- Une fonction de logger personnalisée
- Un intercepteur pour les requêtes reçues

Pourquoi utiliser ce module,

- Il permet de rediriger les logs dans des **fichiers**, sur la **console** et/ou dans **logstash**.
- Il permet de simplement collecter le contenu des requêtes avec des options de filtres.

## Installation

```bash
npm install --save @studiowebux/logger
```

[npm @studiowebux/logger](https://www.npmjs.com/package/@studiowebux/logger)

## Usage

### Configuration

#### Options

| Key            | Value                                                                                                                                                                  | Description                                                                                                  |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| type           | (_Morgan_) - Choix possibles : [**combined**, **tiny**, **dev**, **common**, **short**, **json**]                                                                      | _l'option `format` est seulement utilisé lorsque le type est `json`_                                         |
| tokens         | (_Morgan_) - Une liste qui contient les tokens à intercepter.                                                                                                          | Si laissé à `null`, les tokens par défaut sont utilisés, <br />Voir ci-dessous pour les valeurs par défaut   |
| format         | (_Morgan_) - Les keys/values pour collecter les données de la requête.                                                                                                 | _Seulement utilisé si le type est `json`_                                                                    |
| application_id | (_Winston_) - Un identifiant pour faciliter le tri de l'information.                                                                                                   |                                                                                                              |
| forceConsole   | (_Winston_) - Un booléen pour afficher les logs sur la console en tout temps                                                                                           | Par défaut, les logs ne sont pas affichés en mode production                                                 |
| consoleLevel   | (_Winston_) - Pour déterminer quel niveau de log à afficher sur la console, <br />Choix possibles : [**error**, **warn**, **info**, **verbose**, **debug**, **silly**] | Choisir `silly` affiche tous les niveaux alors que choisir `error` affiche que les ceux-ci.                  |
| logstash       | (_Winston_) - la configuration de logstash                                                                                                                             | Une instance ELK est requise pour utiliser cette option <br /> Seulement la configuration UDP est supportée. |
| filenames      | (_Winston_) - une liste pour rediriger les logs par niveau dans un fichier                                                                                             |                                                                                                              |
| deniedKeys      | (_Winston_) - Une liste de termes qui seront remplacés par '\*\*\*\*\*'                                                                                                | Voir les exemples pour plus d'information                                                                    |

Options disponibles:

```javascript
const options = {
  type: "json", // combined, tiny, dev, common, short, json
  tokens: null,
  format: {
    method: ":method",
    url: ":url",
    status: ":status",
    body: ":body",
    params: ":params",
    query: ":query",
    headers: ":headers",
    "http-version": ":http-version",
    "remote-ip": ":remote-addr",
    "remote-user": ":remote-user",
    length: ":res[content-length]",
    referrer: ":referrer",
    "user-agent": ":user-agent",
    "accept-language": ":language",
    "response-time": ":response-time ms",
  },
  application_id: "Test01",
  forceConsole: false,
  consoleLevel: "silly", // error, warn, info, verbose, debug, silly
  logstash: {
    host: "127.0.0.1",
    port: "5000", // udp only !
  },
  filenames: {
    error: "log/error.log",
    warn: "log/warn.log",
    info: "log/info.log",
    verbose: "log/verbose.log",
    debug: "log/debug.log",
    silly: "log/silly.log",
  },
  deniedKeys: ["password", "authorization", "accessToken", "refreshToken"],
};
```

### Les tokens par défaut:

```javascript
module.exports = [
  {
    name: "body",
    needStringify: true,
  },
  {
    name: "params",
    needStringify: true,
  },
  {
    name: "query",
    needStringify: true,
  },
  {
    name: "headers",
    needStringify: true,
  },
  {
    name: "type",
    needStringify: false,
    value: "content-type",
    parent: "headers",
  },
  {
    name: "language",
    needStringify: false,
    value: "accept-language",
    parent: "headers",
  },
];
```

## Fonctions

### constructor(opts = {}, log = console)

Pour initialiser la configuration et le logger par défaut,

```javascript
const WebuxLogger = require("@studiowebux/logger");

const webuxLogger = new WebuxLogger(opts, console);
```

### CreateLogger(): Object

Cette fonction attaches le logger personnalisé à la variable `log`,  
de plus la fonction retourne le logger directement.

```javascript
const log = webuxLogger.CreateLogger();
```

Pour utiliser les fonctions de log:

> Les deux méthodes sont équivalentes

```javascript
log.info("...");
log.error("...");
log.warn("...");
log.verbose("...");
log.debug("...");
log.silly("...");

webuxLogger.log.info("...");
webuxLogger.log.error("...");
webuxLogger.log.warn("...");
webuxLogger.log.verbose("...");
webuxLogger.log.debug("...");
webuxLogger.log.silly("...");
```

### OnRequest(): Function

Cette fonction configure l’intercepteur de requêtes,

> Il est requis d'avoir une instance d'Express pour attacher la fonction

```javascript
const express = require("express");
const app = express();

const webuxLogger = new WebuxLogger(options, console);

app.use(webuxLogger.OnRequest());
```

## Démarrage rapide

> Le répertoire `/examples` contient plusieurs cas d'utilisation.

### Utiliser l'intercepteur de requête (avec Morgan)

index.js

```javascript
const WebuxLogger = require("@studiowebux/logger");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const options = {
  type: "json",
  format: {
    method: ":method",
    url: ":url",
    status: ":status",
    body: ":body",
    params: ":params",
    query: ":query",
    headers: ":headers",
    "http-version": ":http-version",
    "remote-ip": ":remote-addr",
    "remote-user": ":remote-user",
    length: ":res[content-length]",
    referrer: ":referrer",
    "user-agent": ":user-agent",
    "accept-language": ":language",
    "response-time": ":response-time ms",
  },
};

const webuxLogger = new WebuxLogger(options, console);

app.use(webuxLogger.OnRequest());

app.use(
  bodyParser.json({
    limit: "10MB",
  })
);

app.get("/wait", (req, res) => {
  setTimeout(() => {
    res.status(200).json({ message: "it took 1.5 seconds ..." });
  }, 1500);
});

app.use("*", (req, res) => {
  res.send("BONJOUR !");
});

app.listen(1337, () => {
  webuxLogger.log.info("Server is listening on port 1337");
});
```

- Cette configuration affiche les messages sur la console sans utiliser `Winston`.
- Puis toutes les requêtes sont enregistrées en format `JSON` sans filtre, c'est-à-dire que tout est enregistré.

> Pour ajouter le filtre et les autres options, vous devez configurer et attacher le logger personnalisé.

> \*\* Pour logger le contenu du body, vous devez utiliser le package `body-parser`

### ELK (elastic, Logstash et Kibana)

Le répertoire `examples` contient un Docker pour démarrer une instance de ELK pour faire des tests.

```bash
docker-compose up -d
```

## Vidéos et autres ressources
