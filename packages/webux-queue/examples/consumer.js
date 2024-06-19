import Queue from '../src/index.js';

function waitForIt() {
  return new Promise((resolve) => setTimeout(async () => resolve(), Math.random() * 1000));
}

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
    expiration: (60 * 1000 * 60).toString(), // 1h
    persistent: true,
    requeue: true,
    allUpTo: false,
  },
};

async function handler(q, msg) {
  if (msg !== null) {
    const message = msg;
    console.log('Got Something ! will wait to simulate processing', message.content.toString());
    await waitForIt();

    // if (Math.random() > 0.5) {
    //   console.debug('Acknowledged');
    await q.ack(message);
    // } else {
    //   console.debug('Rejected');
    //   await q.nack(message);
    // }
  } else {
    throw new Error('Failed to get message from server');
  }
}

(async () => {
  const q = new Queue(config);

  await q.connect();
  await q.createChannel('EXAMPLE');

  await q.channel.prefetch(1); // consume one message at a time and wait to send more.
  await q.consumeMessage(handler);

  ['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach((signal) =>
    process.on(signal, async () => {
      await q.disconnectChannel();
      await q.disconnect();
      /** do your logic */
      process.exit();
    }),
  );
})();
