const Queue = require('../src/index');

function waitForIt() {
  return new Promise((resolve) => setTimeout(async () => resolve(), Math.random() * 10000));
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

async function consumeMessage(q) {
  await q.createChannel('EXAMPLE');
  const message = await q.consumeMessage();

  console.log('Got Something !');
  await waitForIt();

  console.log(message.content.toString());

  if (Math.random() > 0.5) {
    console.debug('Acknowledged');
    q.ack(message);
  } else {
    console.debug('Rejected');
    await q.nack(message);
  }

  await q.disconnectChannel();

  // Grab next message
  await consumeMessage(q);
}

(async () => {
  const q = new Queue(config);

  await q.connect();

  await consumeMessage(q);

  await q.disconnect();
})();
