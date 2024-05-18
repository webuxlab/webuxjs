/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2024-05-17
 * License: All rights reserved Studio Webux 2024-Present
 */

const cassandra = require('cassandra-driver');

/**
 * Cassandra driver Wrapper
 * @class scylla
 */
class scylla {
  /**
   * To initialize the cassandra Instance
   * @param {*} opts The options to configure cassandra
   * (The configuration used is the one defined by NODE_ENV or 'development' if not set)
   * @param {*} log The custom logger (By default, it is set to console)
   */
  constructor(opts, log = console) {
    // the opts structure should be defined per the documentation : https://cloud-getting-started.scylladb.com/stable/build-with-javascript.html
    if (!opts) {
      throw new Error('No options has been provided');
    }
    this.config = opts[process.env.NODE_ENV || 'development'];
    this.scylla = new cassandra.Client(this.config);
    this.log = log;
  }

  // TODO: add more functions if necessary.
  //       I think using the cassandra driver directly will be the best approach and only wrap the constructor here.
}

module.exports = scylla;
