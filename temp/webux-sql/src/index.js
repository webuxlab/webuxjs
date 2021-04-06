/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2020-04-07
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

const knex = require('knex');

/**
 * KnexJS Wrapper
 * @class sql
 */
class sql {
  /**
   * To initialize the Knex Instance
   * @param {*} opts The options to configure Knex
   * (The configuration used is the one defined by NODE_ENV or 'development' if not set)
   * @param {*} log The custom logger (By default, it is set to console)
   */
  constructor(opts, log = console) {
    // the opts structure should be defined per the documentation : https://knexjs.org
    if (!opts) {
      throw new Error('No options has been provided');
    }
    this.config = opts[process.env.NODE_ENV || 'development'];
    this.sql = knex(this.config);
    this.log = log;
  }

  /**
   * The migration
   * @param {String} action up, down, latest, rollback, currentVersion, list, make
   * (By default, latest)
   * @param {String} name the name of the new table (Only used with action 'make')
   * @return {Promise}
   */
  Migration(action = 'latest', name = '') {
    if (action !== 'make') {
      this.log.debug(`webux-sql - Run Migration with this '${action}'`);
      return this.sql.migrate[action](this.config);
    }
    this.log.debug(`webux-sql - Create new table named '${name}'`);
    return this.sql.migrate[action](name, this.config);
  }

  /**
   * The seed
   * @param {String} action run, make (By default, run)
   * @param {String} name the name of the new seed (Only used with action 'make')
   * @return {Promise}
   */
  Seed(action = 'run', name = '') {
    if (action !== 'make') {
      this.log.debug(`webux-sql - Run Seed with this '${action}'`);
      return this.sql.seed[action](this.config);
    }
    this.log.debug(`webux-sql - Create new seed named '${name}'`);
    return this.sql.seed.make(name, this.config);
  }
}

module.exports = sql;
