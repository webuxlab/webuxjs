/**
 * @typedef NameGeneratedResponse
 * @property {string} name
 */

import { randomMinMax } from '../../helpers/random.js';
import bankData from './bank.data.js';

/**
 *
 * @returns {NameGeneratedResponse}
 */
function handler() {
  const index = randomMinMax(0, bankData.length);
  return { name: bankData[index] };
}

// curl localhost:1337/api/v1/generator/name -H "X-Api-Key: hello"
export function route(_req, res, _next) {
  res.success(handler());
}
