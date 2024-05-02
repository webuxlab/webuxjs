/**
 * @typedef NameGeneratedResponse
 * @property {string} name
 */

const { randomMinMax } = require('../../helpers/random');
const bankData = require('./bank.data');

/**
 *
 * @returns {NameGeneratedResponse}
 */
function handler() {
  const index = randomMinMax(0, bankData.length);
  return { name: bankData[index] };
}

// curl localhost:1337/api/v1/generator/name -H "X-Api-Key: hello"
function route(_req, res, _next) {
  res.success(handler());
}

module.exports = {
  route,
};
