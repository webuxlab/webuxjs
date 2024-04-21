import RedisStore from 'connect-redis';
import { createClient } from 'redis';

// Initialize client.
const redisClient = createClient({
  url: process.env.REDIS_URL
});
redisClient
  .on('error', (err) => console.log('Redis Client Error', err))
  .connect()
  .catch(console.error);

// Initialize store.
export const redisStore = new RedisStore({
  client: redisClient,
  prefix: `${process.env.REDIS_PREFIX}`
});
