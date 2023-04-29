const { PubSub, logLevel } = require('../src/index');

const logCreator =
  () =>
  ({ namespace, level, label, log }) => {
    console.log({ level, namespace, label, log });
  };

const config = {
  // Documentation: https://kafka.js.org/docs/configuration
  client: {
    clientId: 'my-app-producer-x',
    brokers: ['localhost:9092'],
    logLevel: logLevel.ERROR,
    logCreator,
  },
  // Documentation: https://kafka.js.org/docs/producing
  producer: {},
};

(async () => {
  const pubsub = new PubSub(config);

  pubsub.connect();
  await pubsub.connectProducer();
  setInterval(async () => {
    // await pubsub.sendMessages('demo-abc', [{ value: 'Bonjour' }, { value: 'Comment' }, { value: 'ça' }, { value: 'va' }]);
    await pubsub.sendMessages('demo-abc', [{ value: `Bonjour ${new Date()}` }]);
  }, Math.random() * 2000);
  // await pubsub.disconnectProducer();
})();
