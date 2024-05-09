const InMemory = require('../src/index');

(async () => {
  const inMemory = new InMemory({
    redis_cluster: {
      rootNodes: [
        // this list is used when running from inside docker
        // (I didn't want to setup the whole thing for a quick test..)
        { url: 'redis://redis-node-0:6379' },
        { url: 'redis://redis-node-1:6379' },
        { url: 'redis://redis-node-2:6379' },
        { url: 'redis://redis-node-3:6379' },
        { url: 'redis://redis-node-4:6379' },
        { url: 'redis://redis-node-5:6379' },
      ],
      defaults: {
        password: 'bitnami',
        socket: {
          connectTimeout: 5000,
        },
      },
    },
  });
  await inMemory.initializeCluster();

  await inMemory.cluster.set('key', 'value');
  const value = await inMemory.cluster.get('key');

  console.log('My value', value);

  process.exit(0);
})();
