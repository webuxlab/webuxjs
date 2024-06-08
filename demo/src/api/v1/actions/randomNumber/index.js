/**
 * @typedef {('Integer'|'MinMaxInteger')} RandomOperation
 */

/**
 * @typedef RandomResponse
 * @property {number} value
 */

/**
 *
 * @param {RandomOperation} operation
 * @param {Object} options
 * @param {number} options.min Used with MinMaxInteger
 * @param {number} options.max Used with MinMaxInteger
 * @returns {RandomResponse}
 */
function handler(operation, { min, max }) {
  let value;
  switch (operation) {
    case 'Integer':
      value = Math.floor(Math.random() * 100);
      break;
    case 'MinMaxInteger':
      const minCeiled = Math.ceil(min);
      const maxFloored = Math.floor(max);
      value = Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
      break;
  }

  return { value };
}

// curl -XPOST http://localhost:1337/api/v1/admin/random -H "Accept: application/json" -H "Content-Type: application/json" -d '{"operation":"Integer"}' | jq
export function route(req, res, _next) {
  const { operation, min, max } = req.body;

  res.success(handler(operation, { min, max }));
}
