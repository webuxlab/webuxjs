const webux = require('../../../app/index');
/**
 * Usage as a middleware like this: `apiKey(Webux.Security)`
 * @param {webux.Security} security
 * @returns
 */
module.exports = (security) => (req, _res, next) => {
  const api_key = req.headers['x-api-key'];
  if (!api_key) throw new Error('Missing api key');
  const client = null; // implement your database logic
  if (client) {
    const updated_client = security.ApiKey.check_api_key(client);
    console.debug(updated_client); // implement your database logic
  }
  return next();
};
