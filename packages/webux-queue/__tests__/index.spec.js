const crypto = require('crypto');
const Queue = require('../src');

const logger = {
  verbose: console.debug,
  debug: console.debug,
  log: console.log,
  info: console.log,
  error: console.log,
};

const config = {
  connection: {
    protocol: 'amqp',
    hostname: 'localhost',
    port: 5672,
    username: 'user',
    password: 'password',
    locale: 'en_US',
    frameMax: 0,
    heartbeat: 0,
    vhost: 'my_vhost',
  },
  queue: {
    expiration: (60 * 1000 * 15).toString(), // 15min
    persistent: true,
  },
};

function waitForIt(t = 30000) {
  return new Promise((resolve) => setTimeout(async () => resolve(), t));
}

test.skip('Test Queue Connection and Disconnection', async () => {
  const q = new Queue(
    {
      connection: {
        protocol: 'amqp',
        hostname: 'localhost',
        port: 5672,
        username: 'user',
        password: 'password',
        locale: 'en_US',
        frameMax: 0,
        heartbeat: 0,
        vhost: 'my_vhost',
      },
      queue: {
        expiration: '5000',
        persistent: true,
      },
    },
    logger,
  );

  expect(q).toMatchObject({
    connection: null,
    log: logger,
    config: {},
  });

  await q.connect();
  await q.disconnect();
});

test.skip('Test Channel', async () => {
  const q = new Queue(
    {
      connection: {
        protocol: 'amqp',
        hostname: 'localhost',
        port: 5672,
        username: 'user',
        password: 'password',
        locale: 'en_US',
        frameMax: 0,
        heartbeat: 0,
        vhost: 'my_vhost',
      },
      queue: {
        expiration: (60 * 1000 * 15).toString(), // 15min
        persistent: true,
      },
    },
    logger,
  );

  expect(q).toMatchObject({
    connection: null,
    log: logger,
    config: {},
  });

  try {
    await q.connect();
    await q.createChannel('TestWebuxIntegration');
    await q.sendToQueue(Buffer.from(`Bonjour ${crypto.randomUUID()}`));
    await q.sendToQueue(Buffer.from(`Comment ${crypto.randomUUID()}`));
    await q.sendToQueue(Buffer.from(`Ça ${crypto.randomUUID()}`));
    await q.sendToQueue(Buffer.from(`Va ${crypto.randomUUID()}`));
    await q.sendToQueue(Buffer.from(JSON.stringify({ foo: 'bar', Hello: 'World', 1: 2 })));
    await q.disconnectChannel();
    await q.disconnect();
  } catch (e) {
    await q.disconnectChannel();
    await q.disconnect();
    throw e;
  }
});

test.skip('Consume messages from queue and ack', async () => {
  const q = new Queue(config);

  expect(q).toMatchObject({
    connection: null,
    log: logger,
    config: {},
  });

  try {
    await q.connect();
    await q.createChannel('TestWebuxIntegration');
    const message = await q.consumeMessage();
    console.debug('Full Message', message);
    console.debug('Message', message.content.toString());

    // q.nack(message);
    q.ack(message);

    await q.disconnectChannel();
    await q.disconnect();
  } catch (e) {
    await q.disconnectChannel();
    await q.disconnect();
    throw e;
  }
});

test.skip('Consume messages from queue and nack', async () => {
  const q = new Queue(config);

  expect(q).toMatchObject({
    connection: null,
    log: logger,
    config: {},
  });

  try {
    await q.connect();
    await q.createChannel('TestWebuxIntegration');
    const message = await q.consumeMessage();
    console.debug('Full Message', message);

    q.nack(message);

    await q.disconnectChannel();
    await q.disconnect();
  } catch (e) {
    await q.disconnectChannel();
    await q.disconnect();
    throw e;
  }
});

test.skip('Consume messages from queue and ack after 30sec', async () => {
  const q = new Queue(config);

  expect(q).toMatchObject({
    connection: null,
    log: logger,
    config: {},
  });

  try {
    await q.connect();
    await q.createChannel('TestWebuxIntegration');
    const message = await q.consumeMessage();
    console.debug('Full Message', message);

    await waitForIt(30000);
    console.log('Message processed.');
    q.ack(message);

    await q.disconnectChannel();
    await q.disconnect();
  } catch (e) {
    await q.disconnectChannel();
    await q.disconnect();
    throw e;
  }
});

// test('Consume messages from empty queue', async () => {
//   const q = new Queue(config);

//   expect(q).toMatchObject({
//     connection: null,
//     log: console,
//     config: {},
//   });

//   try {
//     await q.connect();
//     await q.createChannel('TestWebuxIntegrationEmpty');
//     const message = await q.consumeMessage();
//     console.debug('Full Message', message);
//     await q.disconnectChannel();
//     await q.disconnect();
//   } catch (e) {
//     await q.disconnectChannel();
//     await q.disconnect();
//     throw e;
//   }
// });
