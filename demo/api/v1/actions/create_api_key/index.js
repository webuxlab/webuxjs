const Webux = require('../../../../app/index');

/**
 *
 * @returns {}
 */
async function handler({ client_name, description, api_key_length, daily_limit }) {
  // TODO: save the actual client in a database.
  const client = Webux.Security.ApiKey.create_api_key_client(
    client_name,
    description,
    api_key_length,
    daily_limit,
  );

  console.debug('New Client:', client);
  // Use redis to track the daily limit, reduce until hitting 0.
  await Webux.setApiKeyStore.client.set(`apikey.${client.api_key}`, client.limit.daily, {
    EX: parseInt((new Date().setHours(23, 59, 59, 999) - new Date()) / 1000),
  });
  return { client };
}

// curl -XPOST localhost:1337/api/v1/admin/api_key -H "X-Api-Key: hello" -d '{"client_name":"studiowebux","description":"yeahh","api_key_length":42,"daily_limit":9}' -H "Content-Type: application/json"
async function route(req, res, _next) {
  const { client_name, description, api_key_length, daily_limit } = req.body;
  const response = await handler({ client_name, description, api_key_length, daily_limit });
  res.success(response);
}

module.exports = {
  route,
};
