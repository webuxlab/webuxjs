# Introduction

Ce module utilise _Socket.IO_ & _Socket.io-redis_  
De plus, le package _cookie_ est utilisé pour l'authentification.

Il offre 4 possibilités

- Ajout d’une fonction pour vérifier que l’usager est authentifié pour accéder aux ressources.
- Ajout d’une fonction pour configurer un adaptateur Redis, ainsi permettre de connecter plusieurs backend ensemble (instance et processus).
- Basé sur un fichier de configuration, associer les actions dans des namespaces spécifiques ou simplement dans celui par défaut. Le fichier de configuration est très flexible.
- Exposer le Socket.IO directement et l’utiliser directement.

> Prendre note qu'aucun détail n'est donné sur comment utiliser Socket.IO, car le site officiel explique déjà très bien cette portion. [Socket.IO](https://socket.io/)

Le répertoire d’exemple possède un frontend en VueJS pour faire quelques tests. Puis plusieurs solutions pour le backend.

# Installation

```bash
npm install --save @studiowebux/socket
```

[npm @studiowebux/socket](https://www.npmjs.com/package/@studiowebux/socket)

# Usage

# Configuration

La configuration se divise en 3 parties,

## authentication

| Key             | Value                                                                    | Description                                                                                               | Plus d’info                                                                                                              |
| --------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| namespaces      | Une liste (Array) des namespaces pour lesquels appliquer la vérification | NOTE, ajouter le namespace ‘default’, applique l’authentification sur tous les namespaces.                | https://socket.io/docs/migrating-from-0-9/#Socket-io-uses-middleware-now                                                 |
| accessTokenKey  | Un string qui contient le nom du cookie pour le JWT                      | Le JWT doit être gardé dans les Cookies                                                                   |                                                                                                                          |
| isAuthenticated | Un string (path) ou la fonction                                          | `require(path.join(__dirname, ".", "isAuth.js"))` <br />ou <br />`path.join(__dirname, ".", "isAuth.js")` | Cette fonction permet de valider si le client est connecté. **Vous devez fournir votre propre méthode de vérification.** |

## redis

| Key      | Value                      | Description                     |
| -------- | -------------------------- | ------------------------------- |
| host     | l’adresse du serveur redis | par défaut: 127.0.0.1           |
| port     | Le port utilisé            | par défaut : 6379               |
| password | Le mot de passe configuré  | par défaut : aucun mot de passe |

## namespaces

| Key                                                                         | Value                                                                                                                                                                          | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| le nom du namespace (par exemple : "authentication", "default", "whatever") | Une liste (Array) qui contient les chemins (paths) vers les actions                                                                                                            | /Le_répertoire_des_actions/user/{find.js, findOne.js, create.js, update.js, remove.js} <br /><br />Ajouter ce chemin: ‘/absolute_path/user’ dans la liste, va automatiquement charger les 5 actions avec le même format, ‘findUser’ , ‘findOneUser’, ‘createUser.’, ‘updateUser’, ‘removeUser’ <br /><br />Ajouter ce chemin: ‘/absolute_path/user/find.js’ dans la liste, va automatiquement et seulement ajouter ‘findUser’. <br /> le namespace ‘default’ est celui par défaut, donc écrit de cette manière : '/', tous les autres sont écrits de cette manière ‘/namespace_name’ |
| recursionAllowed                                                            | Cette option permet de parcourir les répertoires et d’automatiquement ajouter les actions qui se trouvent dans ceux-ci                                                         | /user/{find.js, findOne.js, create.js, update.js, remove.js} <br/> et <br />/user/profile/{find.js, findOne.js, create.js, update.js, remove.js} <br /><br />En utilisant le répertoire ‘/absolute_path/user’, automatiquement les actions se trouvant dans le répertoire ‘profile’ vont aussi être ajoutées sous cette forme: ‘findUserProfile’                                                                                                                                                                                                                                     |
| ignoreFirstDirectory                                                        | Cette option permet d’enlever le nom du premier répertoire. En résumé, ça permet d’ajouter toutes les actions d’un seul coup en permettant de garder une nomenclature logique. | /actions/user/{find.js, findOne.js, create.js, update.js, remove.js} <br/> et <br />/actions/user/profile/{find.js, findOne.js, create.js, update.js, remove.js} <br /><br />En utilisant le répertoire ‘/absolute_path/actions’, au lieu d’obtenir des noms comme ‘findActionsUser’, ce sera ‘findUser’ et 'findUserProfile’                                                                                                                                                                                                                                                        |

Les options disponibles:

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
  recursionAllowed: false, // to allow the recursion within directory in the actions directories.
  ignoreFirstDirectory: false, // we want to keep the user, message, etc.
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

## Fonctions

### constructor(opts, app, log = console)

Permets d’initialiser le socket (io) en utilisant un serveur **_HTTP/HTTPS_** ou **_Express_**

> Documentation pour utiliser HTTP/HTTPS : https://socket.io/docs/#Using-with-Node-http-server  
> Documentation pour utiliser Express : https://socket.io/docs/#Using-with-Express

```javascript
const WebuxSocket = require("@studiowebux/socket");
const webuxSocket = new WebuxSocket(opts, app, console);
```

Le paramètre `log` permet d'utiliser un logger personnalisé. Par défaut, il est configuré sur la console.

### AddRedis(): Void

Permets d’ajouter Redis pour utiliser un cluster sans perdre les connexions.  
Redis se configure “automatiquement” à partir de la configuration donnée.  
Si aucune configuration n’est définie, la connexion est établie à `127.0.0.1:6379`.  
Pour utiliser Redis, vous devez avoir une instance redis de disponible.  
Pour démarrer une instance pour effectuer des tests, vous pouvez utiliser Docker :

```bash
docker run --rm --name redis -p 6379:6379 redis
```

Pour utiliser la fonction,

```javascript
webuxSocket.AddRedis();
```

De cette manière, il est possible de connecter plusieurs backend ensemble pour faire de l'équilibrage de charge et de la redondance.

### AddAuthentication(): Callback(error, user)

Permets d’ajouter une authentification pour vérifier que l’usager est bien connecté avant d’accéder aux ressources.  
L’authentification se configure par namespace, le fichier de configuration permet de spécifier quel namespace sécuriser facilement.  
Pour plus de détails [io.use](https://socket.io/docs/migrating-from-0-9/#Socket-io-uses-middleware-now)

La fonction utilisée pour vérifier l’authentification doit être fournie par vous, sous forme de fonction ou d’un string (le path vers la fonction)  
Dans le cas où l’usager n’est pas authentifié, le backend retourne une erreur et aucune connexion n’est effectuée.

Pour utiliser la fonction,

```javascript
webuxSocket.AddAuthentication();
```

Le message d'erreur est retourné sur `gotErreur`

### Start(): Void

Cette fonction permet de,

1. Démarrer l’instance socket.IO
2. Configurez automatiquement les actions/namespaces à partir du fichier de configuration (la section namespaces, ignoreFirstDirectory et recursionAllowed)

```bash
webuxSocket.Start();
```

> Dans le cas où la configuration automatique ne fonctionne pas pour votre application, vous pouvez utiliser la fonction `Standalone()`

### Standalone(): Object

Cette fonction permet de :

1. Retourner directement le Socket.IO
2. Utiliser Redis et l'authentification

En résumé,  
Cette fonction permet de tout simplement utiliser Socket.IO, pour faire des trucs personnalisés qui ne peuvent pas être automatisés.

Pour l'usage de Socket.IO, il est recommandé de faire la lecture de la documentation officielle de Socket.IO (https://socket.io/docs/)

```javascript
// Using default namespace
webuxSocket.Standalone().on("connexion", (socket) => {
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
  .on("connexion", (socket) => {
    console.debug(`webux-socket - Socket ${socket.id} connected.`);

    socket.on("disconnect", () => {
      console.debug(`webux-socket - Socket ${socket.id} disconnected.`);
    });

    socket.emit("profileFound", [5, 4, 3, 2, 1, 0]);
  });
```

# Démarrage rapide

## Comment utiliser les événements réservés (reserved events)

C'est-à-dire, les `socket.on('disconnect', (socket)=>{})` et autres.

Voici la liste des événements réservés:

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

### Usage des événements

Vous devez créer un répertoire nommé exactement comme suit : ‘\_ReservedEvents’, puis placer les fichiers comme suit:

```bash
./actions/
  ./_ReservedEvents
    disconnect.js
  ./user
    ...
  ./message
    ...
```

Puis dans le fichier de configuration,

```javascript
const opts = {
  recursionAllowed: true, // can be true or false for this example
  ignoreFirstDirectory: false, // must be set to false for this example
  namespaces: {
    default: [
      path.join(__dirname, "actions", "user"),
      path.join(__dirname, "actions", "message"),
      path.join(__dirname, "actions", "_ReservedEvents"),
    ],
  },
};
```

De cette façon, le namespace par défaut aura on listener sur le disconnect,  
Vous pouvez répéter la même chose pour chacun des événements et ainsi avoir les mêmes events pour plusieurs namespaces ou créer plusieurs dossiers nommés ‘\_ReservedEvents’ et ajouter ceux-ci dans la liste selon le namespace.

## La fonction pour vérifier l’authentification

Cette fonction doit être adaptée à votre projet, voici un exemple avec JWT,

1. Créer un fichier `isAuth.js`

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

Puis dans le fichier ou variable de configuration, modifier la key : `isAuthenticated`,

> Vous pouvez ajouter le chemin vers le fichier ou un require du fichier,

```javascript
const opts = {
  authentication: {
    namespaces: ["profile", "default"],
    accessTokenKey: "accessToken", // The cookie key name
    isAuthenticated: require(path.join(__dirname, ".", "isAuth.js")), // the function to check if the user if authenticated
  },
};
```

De cette manière vous pouvez valider que l’usager est connecté.  
Ce qui est à retenir pour la création de la fonction,

1. Retourner une _promise_
2. Retourner un _objet_ contenant le _payload de l’usager_ en cas de _succès_
3. Retourner un _new Error()_ en cas d'_échec_

## Le fichier Action

Ce fichier doit avoir une structure spécifique pour fonctionner avec la fonction `Start()`

### user/find.js

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

Le fichier action est divisé en 3 parties

- _Controller / Action / Module / Logique / Whatever_  
  Cette partie permet de contacter la DB, de faire une opération quelconque et bien plus.
- _Route_  
  Permet d’exposer une route pour un REST API
  > (ceci ne s'applique pas pour ce module, et si vous utilisez seulement les sockets, cette fonction peut être enlevée)
- _Socket_  
  Cette partie permet de retourner la fonction appelée par le `socket.on`

les paramètres (socket, io) sont passés automatiquement dans la fonction `Start()`
ce que vous pouvez personnaliser, ce sont les paramètres _body_ et _fn_, ceux-ci sont disponibles pour que vous puissiez développer vos actions comme désiré.

## Les callbacks (Acknowledgements)

Oui, vous pouvez retourner un callback, il suffit de spécifier le dernier paramètre comme montré dans l’exemple (le _fn_),  
pour plus d’information : [Acknowledgements](https://socket.io/docs/#Sending-and-getting-data-acknowledgements)

## Les emits

Tous les détails sont disponibles ici : [Emit Cheatsheet](https://socket.io/docs/emit-cheatsheet/)

## Les rooms

Tous les détails sont disponibles ici : [Rooms and namespaces](https://socket.io/docs/rooms-and-namespaces/)

# Vidéos et autres ressources
