# Introduction

Ce module utilise KnexJS

# Installation

```bash
npm install --save @studiowebux/sql
```

[npm @studiowebux/sql](https://www.npmjs.com/package/@studiowebux/sql)

# Usage

## Configurations

### Options

Les options disponibles sont séparées par environnement (development, staging, production et autres)

```javascript
const opts = {
  development: {
    client: "postgresql",
    connection: {
      host: "127.0.0.1",
      user: "webux",
      password: "webux_password",
      database: "webux_sql",
    },
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },
  // production: {},
  // staging: {},
  // test: {}
};
```

La structure des options est la même que pour knexJS. Pour plus de détails, vous pouvez lire la documentation officielle : <a href="https://knexjs.org/#Installation-client" target="_blank">KnexJS</a>

| Option     | Description                                                                  |
| ---------- | ---------------------------------------------------------------------------- |
| client     | Le type de client utilisé, seulement `postgresql` a été testé pour le moment |
| connection | Les informations de connexion et de la base de données                       |
| migrations | le répertoire qui contient toutes les migrations                             |
| seeds      | Le répertoire qui contient toutes les valeurs par défaut                     |

> Pour utiliser ce module, vous devez installer la librairie requise pour votre connexion par rapport à la solution que vous souhaitez utiliser, voir la documentation officielle pour la liste de toutes les librairies : <a href="https://knexjs.org" target="_blank">KnexJS</a>

## Fonctions

### constructor(opts, log = console)

Le constructeur pour initialiser la connexion selon l'environnement et les informations données.

```javascript
const WebuxSQL = require("@studiowebux/sql");

const webuxSQL = new WebuxSQL(opts, console);
```

> Si la variable d'environnement `NODE_ENV` n'est pas définie, ce module va automatiquement utiliser les options définies sous `development`.

> Le paramètre `log` permet d'utiliser un logger personnalisé.

### Migration(action = "latest", name = ""): Promise \<Object\>

Cette fonction permet de lancer les migrations selon l'action demandée.  
le paramètre `name` est seulement requis pour l'action `make`.

> Par défaut, l'action `latest` est utilisée.

Les actions possibles (<a href="https://knexjs.org/#Migrations-API" target="_blank">KnexJS API</a>) :

- up
- down
- latest (<a href="https://knexjs.org/#Migrations-latest" target="_blank">KnexJS Latest</a>)
- rollback
- currentVersion
- list
- make

```javascript
await webuxSQL.Migration();

await webuxSQL.Migration("make", "user");
```

### Seed(action = "run", name = ""): Promise \<Object\>

Cette fonction permet de lancer les seeds selon l'action demandée.  
le paramètre `name` est seulement requis pour l'action `make`.

> Par défaut, l'action `run` est utilisée.

Les actions possibles (<a href="https://knexjs.org/#Seeds-API" target="_blank">KnexJS API</a>) :

- run
- make

```javascript
await webuxSQL.Seed();

await webuxSQL.Seed("make", "user");
```

### Les autres méthodes

Ce module permet d'utiliser knexJS, toutes les fonctions natives sont disponibles par défaut, il est recommandé de lire la documentation officielle pour en apprendre davantage,

<a href="https://knexjs.org/" target="_blank">KnexJS Documentation</a>

Exemple avec un select:

```javascript
const users = await webuxSQL.sql.select("*").from("Users");
if (!users || users.length === 0) {
  console.error("No users found");
}
console.log(users);
```

# Démarrage rapide

Dans l'exemple ci-dessous, la base de données utilisée est `postgresql`.  
Il est requis d'installer la librairie de postgres dans le projet avec la commande suivante : `npm install pg`

### Étape 1 - Installer pg

```bash
npm install --save pg
```

### Étape 2 - Démarrer un serveur postgres avec Docker

```bash
docker run -d --name webux_db -e POSTGRES_PASSWORD=webux_password -e POSTGRES_USER=webux -e POSTGRES_DB=webux_sql -p 5432:5432 postgres:latest
```

### Étape 3 - Créer le fichier postgres.js

```javascript
const WebuxSQL = require("@studiowebux/sql");

const opts = {
  development: {
    client: "postgresql",
    connection: {
      host: "127.0.0.1",
      user: "webux",
      password: "webux_password",
      database: "webux_sql",
    },
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },
  // production: {},
  // staging: {},
  // test: {}
};

const webuxSQL = new WebuxSQL(opts);

async function database() {
  try {
    // Try to run the migration if there is any
    await webuxSQL.Migration().catch((e) => {
      console.log("We can safely ignore this error for this test");
    });

    const exist = await webuxSQL.sql.schema.hasTable("Users");

    if (!exist) {
      await webuxSQL.Migration("make", "Users");
      await webuxSQL.Migration("make", "Empty");
      console.log("*** You should put some stuffs within the migration file");
      await webuxSQL.Seed("make", "Users");
      console.log("*** You should put some stuffs within the seed file");
      console.log("After configuring the files, you can relaunch the script.");
      process.exit(0);
    }

    // Try to run the seed if there is any
    await webuxSQL.Seed();

    const users = await webuxSQL.sql.select("*").from("Users");
    if (!users || users.length === 0) {
      console.error("No users found");
    }
    console.log(users);

    const empty = await webuxSQL.sql.select("*").from("Empty");
    if (!empty || empty.length === 0) {
      console.error("The empty table is empty, good news !");
    }
    console.log(empty);

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(42);
  }
}

// call our scripts
database();
```

Lancer le script au moins une fois, celui-ci va créer les migrations,

```bash
node postgres.js
```

Après avoir lancé la commande, 2 répertoires devraient avoir été créés, `./migrations` et `./seeds`

> Dans un contexte de production, vous pouvez créer un script dans un 'sidecar' qui sera lancé avant le déploiement pour initialiser et créer les données par défaut, lors du lancement officiel de votre application ou pour faire les tests et l'environnement de staging.

### Étape 4 - Ajouter le contenu dans les migrations et seeds

migrations/Empty.js

```javascript
exports.up = function (knex) {
  return knex.schema.createTable("Empty", function (table) {
    table.increments(); // id (PK)
    table.timestamps(); // created_at & updated_at
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("Empty");
};
```

migrations/Users.js

```javascript
exports.up = function (knex) {
  return knex.schema.createTable("Users", function (table) {
    table.increments(); // id (PK)
    table.string("fullname"); // fullname (varchar(255))
    table.timestamps(); // created_at & updated_at
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("Users");
};
```

seeds/Users.js

```javascript
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("Users")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("Users").insert([
        { id: 1, fullname: "John Doe" },
        { id: 2, fullname: "Jane Doe" },
        { id: 3, fullname: "Junior Doe" },
      ]);
    });
};
```

### Étape 5 - Lancer le script une seconde fois

Après avoir défini la structure de la base de données et créé le contenu par défaut, lancez cette commande :

```bash
node postgres.js
```

Avec les fichiers de migrations et les seeds vous devriez obtenir ceci:

```bash
webux-sql - Run Migration with this 'latest'
webux-sql - Run Seed with this 'run'
[ { id: 1,
    fullname: 'John Doe',
    created_at: null,
    updated_at: null },
  { id: 2,
    fullname: 'Jane Doe',
    created_at: null,
    updated_at: null },
  { id: 3,
    fullname: 'Junior Doe',
    created_at: null,
    updated_at: null } ]
The empty table is empty, good news !
[]
```

# Vidéos et autres ressources
