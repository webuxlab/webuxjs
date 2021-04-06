## Introduction

This module uses KnexJS.

For more details (EN/FR) : <a href="https://github.com/studiowebux/webux-sql/wiki" target="_blank">Wiki</a>

## Installation

```bash
npm install --save @studiowebux/sql
```

[NPM](https://www.npmjs.com/package/@studiowebux/sql)

## Usage

### Configurations

#### Options

The available options are split by environment (development, staging, production and others).

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

The options structure is the same as KnexJS, for more details, you can read the official documentation : <a href="https://knexjs.org/#Installation-client" target="_blank">KnexJS</a>

| Option     | Description                                            |
| ---------- | ------------------------------------------------------ |
| client     | The client type, only `postgresql` has been tested yet |
| connection | database and connection information                    |
| migrations | The directory that contains all migrations             |
| seeds      | The directory that contains all seeds                  |

> To use this module, you must install the library required by the chosen solution, read the official documentation to get the complete list : <a href="https://knexjs.org" target="_blank">KnexJS</a>

### Functions

#### constructor(opts, log = console)

It initializes the connection according to the environment and the client configuration.

```javascript
const WebuxSQL = require("@studiowebux/sql");

const webuxSQL = new WebuxSQL(opts, console);
```

> If the environment variable `NODE_ENV` is not define, this module will automatically use the configuration under the `development` key.

> The `log` parameter allows to use a custom logger function.

#### Migration(action = "latest", name = ""): Promise \<Object\>

This function allows to launch the migration with a specific action.  
The parameter `name` is only required with this action : `make`.

> By default, the action `latest` is used.

Possible actions (<a href="https://knexjs.org/#Migrations-API" target="_blank">KnexJS API</a>) :

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

#### Seed(action = "run", name = ""): Promise \<Object\>

This function allows to launch the seeds with a specific action.  
The parameter `name` is only required with this action : `make`.

> By default, the action `run` is used.

Possible actions (<a href="https://knexjs.org/#Seeds-API" target="_blank">KnexJS API</a>) :

- run
- make

```javascript
await webuxSQL.Seed();

await webuxSQL.Seed("make", "user");
```

#### Other methods / KnexJS Functions

This module allows to use knexJS, this means that all native functions are available by default. This is recommended to read the official documentation to know more about this powerful library,

<a href="https://knexjs.org/" target="_blank">KnexJS Documentation</a>

Example with a select:

```javascript
const users = await webuxSQL.sql.select("*").from("Users");
if (!users || users.length === 0) {
  console.error("No users found");
}
console.log(users);
```

## Quick Start

This example used the `postgresql` database.  
It is required to install the postgres library using this command: `npm install pg`

#### Step 1 - Install pg

```bash
npm install --save pg
```

#### Step 2 - Start a postgres server with Docker

```bash
docker run -d --name webux_db -e POSTGRES_PASSWORD=webux_password -e POSTGRES_USER=webux -e POSTGRES_DB=webux_sql -p 5432:5432 postgres:latest
```

#### Step 3 - Create the postgres.js file

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
      console.log("*** You should put some stuffs within the migration files");
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

Launch the script at least one time, it will create the empty migration files,

```bash
node postgres.js
```

After launching the script, you should have 2 new directories, `./migrations` and `./seeds`

#### Step 4 - Add content in the migrations and seeds files

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

#### Step 5 - Launch the script with the real configuration

Launch this command :

```bash
node postgres.js
```

Using the content above (Step 4), you should get this :

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

## Feature Request

## Last Version

- 2020-04-26 : v1.0.0 - [Github](https://github.com/studiowebux/webux-sql) / [NPM](https://www.npmjs.com/package/@studiowebux/sql)

## Videos and other resources

## Contribution

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## license

SEE LICENSE IN license.txt
