const { createClient, createCluster } = require('redis');

class InMemory {
  /**
   * Initialize the in-memory module
   * @param {Object} opts
   * @param {Object} log Custom logger, by default: console
   * @returns {VoidFunction}
   */
  constructor(opts, log = console) {
    // REDIS Config: https://github.com/redis/node-redis/blob/HEAD/docs/client-configuration.md
    this.config = opts || {};
    this.log = log;

    this.client = null;
    this.cluster = null;
  }

  /**
   * Setup a redis connection
   * @param {*} mode 'redis'
   * @returns a connected redis instance
   */
  async initialize(mode = 'redis') {
    if (mode === 'redis') {
      this.client = await createClient(this.config.redis)
        .on('error', (err) => this.log.error('Redis Client Error', err))
        .connect();

      return this.client;
    } else {
      throw new Error(`${mode} not implemented.`);
    }
  }

  /**
   * Setup a redis cluster connection, https://github.com/redis/node-redis/blob/HEAD/docs/clustering.md
   * @param {*} mode 'redis'
   * @returns a connected redis cluster instance
   */
  async initializeCluster(mode = 'redis') {
    if (mode === 'redis') {
      this.cluster = createCluster(this.config.redis_cluster);
      this.cluster.on('error', (err) => this.log.error('Redis Cluster Error', err));
      await this.cluster.connect();

      return this.cluster;
    } else {
      throw new Error(`${mode} not implemented.`);
    }
  }
}

module.exports = InMemory;
