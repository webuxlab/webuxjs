const Queue = require('../src/index');

function waitForIt() {
  return new Promise((resolve) => setTimeout(async () => resolve(), Math.random() * 30000));
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
  },
};

async function publishMessage(q) {
  await q.sendToQueue(Buffer.from(JSON.stringify({ datetime: new Date() })));
}

(async () => {
  const q = new Queue(config);

  await q.connect();
  await q.createChannel('EXAMPLE');

  for (let i = 0; i < 100; i += 1) await publishMessage(q);

  await q.disconnectChannel();
  await q.disconnect();
})();
