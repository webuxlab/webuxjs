export default {
  // Read/Write Instance(s)
  api_key: {
    redis: {
      url: ['redis://redis:6379'],
    },
  },
  // Read Only Instance(s)
  api_key_read_only: {
    redis: {
      url: ['redis://redis-readonly:6379'],
    },
  },
  redis_cluster: {},
};
