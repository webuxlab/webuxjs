import Queue from '../src/index.js';

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

async function publishMessage(q, msg) {
  await q.sendToQueue(Buffer.from(JSON.stringify({ datetime: new Date(), payload: msg })));
}

(async () => {
  const q = new Queue(config);

  await q.connect();
  await q.createChannel('EXAMPLE');

  let t = 0;
  // console.log('Send 100 messages to the queue');
  // for (let i = 0; i < 100; i += 1) await publishMessage(q, `message #${i}`);
  setInterval(async () => {
    for (let i = 0; i < 10; i += 1) await publishMessage(q, `message #${t}-${i}`);
    // await publishMessage(q, `message #${i}`);
    t++;
  }, 1000);

  // await q.disconnectChannel();
  // await q.disconnect();
})();
