import InMemory from '../src/index.js';

(async () => {
  const readWrite = new InMemory({ redis: { url: 'redis://localhost:6379' } });
  const readOnly = new InMemory({ redis: { url: 'redis://localhost:6380' } });
  await readWrite.initialize();
  await readOnly.initialize();
  const redis_rw_info = await readWrite.client.info('Replication');
  const redis_ro_info = await readOnly.client.info('Replication');

  console.log(redis_rw_info);
  console.log(redis_ro_info);

  await readWrite.client.set('webux', 'lab');
  const ro_response = await readOnly.client.get('webux');
  const rw_response = await readOnly.client.get('webux');
  console.log('ro: ', ro_response);
  console.log('rw: ', rw_response);

  await readOnly.client.set('this', 'should not work.');

  process.exit(0);
})();
