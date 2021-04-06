const WebuxSQL = require('../src');

// docker run --rm \
// -e POSTGRES_PASSWORD=webux_password \
// -e POSTGRES_USER=webux \
// -e POSTGRES_DB=webux_sql_test \
// -p 5433:5432 postgres:latest
test('Test migration', async () => {
  const opts = {
    test: {
      client: 'postgresql',
      connection: {
        host: '127.0.0.1',
        port: 5433,
        user: 'webux',
        password: 'webux_password',
        database: 'webux_sql_test',
      },
      migrations: {
        directory: './examples/migrations',
      },
      seeds: {
        directory: './examples/seeds',
      },
    },
  };

  const webuxSQL = new WebuxSQL(opts);

  await webuxSQL.Migration();

  const userExist = await webuxSQL.sql.schema.hasTable('Users');
  const emptyExist = await webuxSQL.sql.schema.hasTable('Empty');

  webuxSQL.sql.destroy();

  expect(userExist).toBeTruthy();
  expect(emptyExist).toBeTruthy();
});
