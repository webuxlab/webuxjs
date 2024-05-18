const Webux = require('../../../app/index');
/**
 * Usage as a middleware like this: `apiKey(Webux.Security)`
 * @param {Webux.Security} security
 * @returns
 */
module.exports = (security) => async (req, _res, next) => {
  const api_key = req.headers['x-api-key'];
  if (!api_key) return next(Webux.ErrorHandler(400, 'Missing API Key'));
  const usage = await Webux.getApiKeyStore.client.get(`apikey.${api_key}`);
  if (usage <= 0) {
    return next(
      Webux.ErrorHandler(429, 'API Key usage limit reached'),
    );
    // TODO: implement mongoDB or something like that to manage the user.
    // const client = null;
    // const updated_client = security.ApiKey.check_api_key(client);
    // console.debug(updated_client); // implement your database logic
  }
  await Webux.setApiKeyStore.client.set(`apikey.${api_key}`, usage - 1);
  return next();
};
