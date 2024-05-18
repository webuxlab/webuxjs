const Webux = require('../../../../app/index');

/**
 *
 * @returns {}
 */
async function handler({ api_key }) {
  // Use redis to track the daily limit, reduce until hitting 0.
  const usage = await Webux.getApiKeyStore.client.get(`apikey.${api_key}`);
  console.log('usage:', usage);
  return { usage };
}

// curl -XGET localhost:1337/api/v1/admin/api_key/usage -H "X-Api-Key: hello"
async function route(req, res, _next) {
  const api_key = req.headers['x-api-key'];
  const response = await handler({ api_key });
  res.success(response);
}

module.exports = {
  route,
};
