/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2019-05-25
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

const redisAdapter = require('socket.io-redis');

/**
 * Configure the redis adapter
 * @return {VoidFunction}
 */
function AttachAdapter() {
  if (!this.config || !this.config.redis) {
    this.log.debug('webux-Socket - Unable to configure Redis.');
    throw new Error('No Options provided to configure redis');
  }

  this.log.info('webux-socket - Configuring Redis Adapter.');

  this.io.adapter(
    redisAdapter({
      host: this.config.redis.host,
      port: this.config.redis.port,
      auth_pass: this.config.redis.password,
    }),
  );
}

module.exports = AttachAdapter;
