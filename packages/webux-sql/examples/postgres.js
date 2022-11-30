/**
 * Please Install the postgres dependencies before,
 * (please read the KnexJS documentation to add another Database, https://knexjs.org/)
 * npm install pg --save
 *
 * Please launch this docker to have the actual DB
 * docker run -d --name webux_db \
 * -e POSTGRES_PASSWORD=webux_password \
 * -e POSTGRES_USER=webux \
 * -e POSTGRES_DB=webux_sql \
 * -p 5432:5432 \
 * postgres:latest
 *
 * node postgres.js
 *
 * and run the same command after filling the files created,
 *
 * node postgres.js
 *
 * You should get the users.
 *
 * Follow this guide, if needed:
 * https://knexjs.org/#Migrations
 */

/**
 * File: postgres.js
 * Author: Tommy Gingras
 * Date: 2020-04-09
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

const WebuxSQL = require('../src/index');

const opts = {
  development: {
    client: 'postgresql',
    connection: {
      host: '192.168.2.19',
      port: '5433',
      user: 'webux',
      password: 'webux_password',
      database: 'webux_sql',
    },
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },
  // production: {},
  // staging: {},
  // test: {}
};

const webuxSQL = new WebuxSQL(opts);

/**
 * Do some stuffs with the database
 */
async function database() {
  try {
    // Try to run the migration if there is any
    await webuxSQL.Migration().catch((e) => {
      console.error(e);
      console.log('We can safely ignore this error for this test');
    });

    const exist = await webuxSQL.sql.schema.hasTable('Users');

    if (!exist) {
      await webuxSQL.Migration('make', 'Users');
      await webuxSQL.Migration('make', 'Empty');
      console.log('*** You should put some stuffs within the migration files');
      await webuxSQL.Seed('make', 'Users');
      console.log('*** You should put some stuffs within the seed file');
      console.log('After configuring the files, you can relaunch the script.');
      process.exit(0);
    }

    // Try to run the seed if there is any
    await webuxSQL.Seed();

    const users = await webuxSQL.sql.select('*').from('Users');
    if (!users || users.length === 0) {
      console.error('No users found');
    }
    console.log(users);

    const empty = await webuxSQL.sql.select('*').from('Empty');
    if (!empty || empty.length === 0) {
      console.error('The empty table is empty, good news !');
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
