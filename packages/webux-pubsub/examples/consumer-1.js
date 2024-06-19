import { PubSub } from '../src/index.js';

function waitForIt(t) {
  return new Promise((resolve) => setTimeout(async () => resolve(), t));
}

const config = {
  // Documentation: https://kafka.js.org/docs/configuration
  client: {
    clientId: 'my-app-consumer-1',
    brokers: ['localhost:9092'],
  },
  // Documentation: https://kafka.js.org/docs/producing
  consumer: { subscribe: { fromBeginning: false } },
};

(async () => {
  const pubsub = new PubSub(config);

  pubsub.connect();
  await pubsub.connectConsumer('consumer-1');
  await pubsub.consumeMessage(['demo-abc'], async ({ topic, partition, message }) => {
    console.log('Sending payload to Queue or API or whatever.');
    console.debug({
      value: message.value.toString(),
      topic,
      partition,
    });
    await waitForIt(Math.random() * 3000);
    console.log('Sent !');
  });
})();
