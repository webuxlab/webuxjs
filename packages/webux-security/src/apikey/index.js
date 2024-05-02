/**
 * Handle API Key features
 * This module does not handle the save/retrieval of the data,
 * it only offers simple function to manipulate the data.
 * It is the user responsability to implement the database.
 * It is the user responsability to create the middleware.
 * @module apikey
 */

const { randomUUID, randomBytes } = require('node:crypto');

/**
 * API Key Limit
 * @typedef {Object} ApiKeyLimit
 * @property {number} daily the number of requests allowed on a daily basis
 */

/**
 * API Key Usage
 * @typedef {Object} ApiKeyUsage
 * @property {Object.<string, number>} daily_usage a key/value mapping to track daily usage
 */

/**
 * API Key Client
 * @typedef {Object} ApiKeyClient
 * @property {Date} created_at
 * @property {Date} updated_at
 * @property {string} api_key
 * @property {string} description
 * @property {string} name
 * @property {string} id
 * @property {ApiKeyUsage} usage
 * @property {ApiKeyLimit} limit
 */

/**
 * Generate a random string
 * @param {number} api_key_length length of the api key to generate
 * @returns {string} The client api key
 */
function generate_api_key(api_key_length = 42) {
  return randomBytes(api_key_length).toString('hex').substring(0, api_key_length);
}

/**
 * Create a json object representing the user and returns it
 * @param {string} name the api key client name
 * @param {string} description api key description if any
 * @param {number} api_key_length length of the api key to generate
 * @param {number} daily_limit the number of requests allowed on a daily basis
 * @returns {ApiKeyClient} a client
 */
function create_api_key_client(name, description, api_key_length, daily_limit = 0) {
  return {
    created_at: new Date(),
    updated_at: null,
    api_key: generate_api_key(api_key_length),
    description,
    name,
    id: randomUUID(),
    usage: {},
    limit: { daily: daily_limit },
  };
}

/**
 * Update the usage object
 * This function should be reviewed and tested under heavy load as it does not seem to be scalable.
 * @param {ApiKeyUsage} usage the current usage for a client
 * @returns {ApiKeyUsage}
 */
function update_usage(usage) {
  const today = new Date().toISOString().split('T')[0];
  return { ...usage, [today]: (usage[today] || 0) + 1 };
}

/**
 * Reset the daily usage to 0
 * @param {ApiKeyUsage} usage the current usage for a client
 * @returns {ApiKeyUsage}
 */
function reset_usage(usage) {
  const today = new Date().toISOString().split('T')[0];
  return { ...usage, [today]: 0 };
}

/**
 * Update the daily limit
 * @param {number} daily the new daily limit to apply
 * @returns {ApiKeyLimit}
 */
function update_limit(daily) {
  return {
    daily,
  };
}

/**
 * Check if the client has enough request remaining for the period,
 * if so it updates the client object and returns it.
 * Otherwise it throws an error.
 * @param {ApiKeyClient} client The current client and usage associated
 * @returns {ApiKeyClient} return the updated client
 * @throws 'Api key limit reached' If the daily limit is exhausted
 */
function check_api_key(client) {
  const today = new Date().toISOString().split('T')[0];
  if (client.limit.daily <= 0) throw new Error('This API Key has no limit configured');
  if (client.usage[today] >= client.limit.daily) {
    throw new Error('Api key limit reached');
  }

  const payload = { ...client, usage: { ...update_usage(client.usage) } };
  return payload;
}

module.exports = {
  generate_api_key,
  create_api_key_client,
  update_usage,
  update_limit,
  reset_usage,
  check_api_key,
};
