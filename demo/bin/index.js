/**
 * File: index.js
 * Author: Studio Webux
 * Date: 2021-02-17
 * License: MIT
 */

require('dotenv').config();

/**
 * Load the Application modules and configurations
 */
const Webux = require('../app');

/**
 * It initializes the server
 */
(async () => {
  await Webux.Initialize();

  Webux.Security.SetResponseHeader(Webux.app);
  Webux.Security.SetBodyParser(Webux.app);
  Webux.Security.SetCookieParser(Webux.app);
  Webux.Security.SetCors(Webux.app);
  Webux.Security.SetGlobal(Webux.app);
  Webux.Security.CreateRateLimiters(Webux.app);

  Webux.View.InitView(Webux.app);

  Webux.app.use(Webux.I18nOnRequest());

  Webux.app.set('node_env', process.env.NODE_ENV || 'development');
  Webux.app.set('port', process.env.PORT || Webux.config.server.port);

  Webux.app.use(Webux.Logger.OnRequest());

  await Webux.Route.LoadResponse(Webux.app);
  await Webux.Route.LoadRoute(Webux.router);

  // Authentication & Authorization
  Webux.auth.load_redis_store();
  Webux.app.use(Webux.auth.load_express_session());
  await Webux.auth.initialize_keycloak_issuer();
  Webux.auth.initialize_keycloak_client();
  Webux.auth.initialize_passport();
  Webux.app.use(Webux.auth.passport_session());

  Webux.app.use('/', Webux.router);
  await Webux.Route.LoadStatic(Webux.app, Webux.express);

  Webux.app.use(Webux.NotFoundErrorHandler());
  Webux.app.use(Webux.GlobalErrorHandler());

  await Webux.Server.StartServer();

  Webux.Socket.Initialize(Webux.Server.server);

  Webux.Socket.Start();
})();
