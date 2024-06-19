export default {
  // Read/Write Instance(s)
  api_key: {
    redis: {
      url: ['redis://demo-wl-redis:6379'],
    },
  },
  // Read Only Instance(s)
  api_key_read_only: {
    redis: {
      url: ['redis://demo-wl-redis-readonly:6379'],
    },
  },
  redis_cluster: {},
};
