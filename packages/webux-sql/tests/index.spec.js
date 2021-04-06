const WebuxSQL = require('../src');

test('Create new WebuxSQL instance without options', () => {
  function check() {
    const sql = new WebuxSQL();
    return sql;
  }
  expect(check).toThrowError('No options has been provided');
});

test('Create new WebuxSQL instance with options', () => {
  const opts = {
    test: {
      client: 'postgresql',
      connection: {
        host: '127.0.0.1',
        user: 'webux',
        password: 'webux_password',
        database: 'webux_sql',
      },
      migrations: {
        directory: './examples/migrations',
      },
      seeds: {
        directory: './examples/seeds',
      },
    },
  };

  const sql = new WebuxSQL(opts);

  expect(sql).toBeInstanceOf(Object);
});

test('test new features', async () => {
  const opts = {
    test: {
      client: 'postgresql',
      connection: {
        host: '127.0.0.1',
        user: 'webux',
        password: 'webux_password',
        database: 'webux_sql',
      },
      migrations: {
        directory: './examples/migrations',
      },
      seeds: {
        directory: './examples/seeds',
      },
    },
  };

  const sql = new WebuxSQL(opts);

  expect(sql).toBeInstanceOf(Object);

  await sql.Migration();

  const response1 = await sql
    .sql('Users')
    .insert({ fullname: 'Tommy' })
    .onConflict('fullname')
    .merge();

  expect(response1).toHaveProperty('command', 'INSERT');
  expect(response1).toHaveProperty('rowCount', 1);

  const response2 = await sql
    .sql('Users')
    .insert({ fullname: 'Tommy' })
    .onConflict('fullname')
    .ignore();

  expect(response2).toHaveProperty('command', 'INSERT');
  expect(response2).toHaveProperty('rowCount', 0);

  sql.sql.destroy();
});
