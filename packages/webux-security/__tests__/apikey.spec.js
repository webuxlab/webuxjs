const { generate_api_key, create_api_key_client, update_usage, update_limit, reset_usage, check_api_key } = require('../src/apikey/index');

test('Generate API Key', () => {
  const api_key = generate_api_key(42);

  expect(api_key.length).toBe(42);
});

test('Create new client', () => {
  const client = create_api_key_client('test', '', 42, 0);

  expect(client).toMatchObject({
    name: 'test',
    description: '',
    usage: {},
    api_key: expect.any(String),
    id: expect.any(String),
    created_at: expect.any(Date),
    updated_at: null,
    limit: { daily: 0 },
  });
});

test('Update Usage from 0', () => {
  const usage = update_usage({});

  const today = new Date().toISOString().split('T')[0];
  expect(usage).toMatchObject({
    [today]: 1,
  });
});

test('Update Usage from 42', () => {
  const today = new Date().toISOString().split('T')[0];
  const usage = update_usage({ [today]: 42 });

  expect(usage).toMatchObject({
    [today]: 43,
  });
});

test('Update limit', () => {
  const client = {
    name: 'test',
    description: '',
    usage: {},
    api_key: 'abc123',
    id: '123abc',
    created_at: new Date(),
    updated_at: null,
    limit: { daily: 0 },
  };

  client.limit = update_limit(50000);

  expect(client.limit).toMatchObject({
    daily: 50000,
  });
});

test('Reset usage', () => {
  const today = new Date().toISOString().split('T')[0];
  const client = {
    name: 'test',
    description: '',
    usage: {
      '2024-04-29': 111,
      ...update_usage({ [today]: 42 }),
    },
    api_key: 'abc123',
    id: '123abc',
    created_at: new Date(),
    updated_at: null,
    limit: { daily: 0 },
  };
  expect(client.usage).toMatchObject({
    '2024-04-29': 111,
    [today]: 43,
  });

  client.limit = update_limit(50000);

  expect(client.limit).toMatchObject({
    daily: 50000,
  });

  client.usage = reset_usage(client.usage);

  expect(client.usage).toMatchObject({
    [today]: 0,
    '2024-04-29': 111,
  });
});

test('Check API Key Usage', () => {
  let client = create_api_key_client('test', '', 42, 10);
  const today = new Date().toISOString().split('T')[0];

  expect(client).toMatchObject({
    name: 'test',
    description: '',
    usage: {},
    api_key: expect.any(String),
    id: expect.any(String),
    created_at: expect.any(Date),
    updated_at: null,
    limit: { daily: 10 },
  });

  for (let i = 0; i < 10; i++) {
    // Im sorry this is bad practice ...
    client = check_api_key(client);
  }

  expect(client.usage[today]).toBe(10);
});

test('Check API Key Usage and error handling', () => {
  const t = () => {
    let client = create_api_key_client('test', '', 42, 10);

    expect(client).toMatchObject({
      name: 'test',
      description: '',
      usage: {},
      api_key: expect.any(String),
      id: expect.any(String),
      created_at: expect.any(Date),
      updated_at: null,
      limit: { daily: 10 },
    });

    for (let i = 0; i < 11; i++) {
      // Im sorry this is bad practice ...
      client = check_api_key(client);
    }
  };

  expect(t).toThrow('Api key limit reached');
});
