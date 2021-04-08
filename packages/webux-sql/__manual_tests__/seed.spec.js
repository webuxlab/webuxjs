const WebuxSQL = require('../src');

// docker run --rm \
// -e POSTGRES_PASSWORD=webux_password
// -e POSTGRES_USER=webux
// -e POSTGRES_DB=webux_sql_test
// -p 5433:5432 postgres:latest
test('Test seed', async () => {
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
      asyncStackTraces: true,
      debug: true,
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
  await webuxSQL.Seed();

  const users = await webuxSQL.sql.select('*').from('Users');
  if (!users || users.length === 0) {
    throw new Error('No users found');
  }

  const empty = await webuxSQL.sql.select('*').from('Empty');
  if (empty && empty.length !== 0) {
    throw new Error('The empty table is not empty');
  }

  webuxSQL.sql.destroy();

  expect(users).toMatchObject([
    {
      id: 1,
      fullname: 'John Doe',
      created_at: null,
      updated_at: null,
    },
    {
      id: 2,
      fullname: 'Jane Doe',
      created_at: null,
      updated_at: null,
    },
    {
      id: 3,
      fullname: 'Junior Doe',
      created_at: null,
      updated_at: null,
    },
  ]);

  expect(empty).toMatchObject([]);
});
