/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2024-04-17
 * License: All rights reserved Studio Webux 2024-Present
 */

const gremlin = require('gremlin');

/**
 * Gremlin Wrapper
 * @class janusgraph
 */
class janusgraph {
  /**
   * To initialize the gremlin Instance
   * @param {*} opts The options to configure gremlin
   * (The configuration used is the one defined by NODE_ENV or 'development' if not set)
   * @param {*} log The custom logger (By default, it is set to console)
   */
  constructor(opts, log = console) {
    // the opts structure should be defined per the documentation : https://www.npmjs.com/package/gremlin
    // https://tinkerpop.apache.org/docs/current/reference/#gremlin-javascript
    if (!opts) {
      throw new Error('No options has been provided');
    }
    this.config = opts[process.env.NODE_ENV || 'development'];
    this.log = log;

    const traversal = gremlin.process.AnonymousTraversalSource.traversal;
    const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;
    const authenticator = this.config.authenticator || undefined;
    this.gremlin = traversal().withRemote(new DriverRemoteConnection(this.config.url, this.config.options));
  }
}

module.exports = janusgraph;
