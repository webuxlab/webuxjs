import InMemory from '../src/index.js';

(async () => {
  const inMemory = new InMemory({ redis: { url: 'redis://localhost:6379' } });
  await inMemory.initialize();
  const redis_info = await inMemory.client.info();

  console.log(redis_info);

  process.exit(0);
})();
