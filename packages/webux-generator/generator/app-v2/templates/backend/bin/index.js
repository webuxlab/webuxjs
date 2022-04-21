/**
 * File: index.js
 * Author: Studio Webux S.E.N.C
 * Date: 2021-02-17
 * License: MIT
 */

/**
 * Load the Application modules and configurations
 */
 const Webux = require('../app');

 /**
  * It initializes the server
  */
 (async () => {
   Webux.Initialize();
 
   Webux.Security.SetResponseHeader(Webux.app);
   Webux.Security.SetBodyParser(Webux.app);
   Webux.Security.SetCookieParser(Webux.app);
   Webux.Security.SetCors(Webux.app);
   Webux.Security.SetGlobal(Webux.app);
   Webux.Security.CreateRateLimiters(Webux.app);
 
   Webux.app.use(Webux.I18nOnRequest());
 
   Webux.app.set('node_env', process.env.NODE_ENV || 'development');
   Webux.app.set('port', process.env.PORT || Webux.config.server.port);
 
   Webux.app.use(Webux.Logger.OnRequest());
 
   await Webux.Route.LoadResponse(Webux.app);
 
   await Webux.Server.StartServer();
 
   Webux.Socket.Initialize(Webux.Server.server);
 
   Webux.Socket.Start();
 })();