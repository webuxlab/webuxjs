const expressSession = require('express-session');
const { Issuer, custom, Strategy, TokenSet } = require('openid-client');
const passport = require('passport');
const RedisStore = require('connect-redis');
const { createClient } = require('redis');

class Auth {
  /**
   * Initialize the authentication module
   * @param {Object} opts
   * @param {Object} store in memory, redis and etc.
   * @param {Object} app Express Application
   * @param {Object} log Custom logger, by default: console
   * @returns {VoidFunction}
   */
  constructor(opts, store, app, log = console) {
    this.config = opts || {};
    this.log = log;
    this.store = store; // session

    this.app = app;
    this.issue = null;
    this.client = null;
  }

  //
  // SESSION
  //

  /**
   * Function to be wrapped in a app.use()
   * Enable Express session with user selected store
   * @returns {any}
   */
  load_express_session() {
    return expressSession({
      secret: this.config.session.express_session_secret,
      resave: this.config.session.resave,
      saveUninitialized: this.config.session.save_uninitialized,
      store: this.store,
      cookie: this.config.session.cookie,
    });
  }

  /**
   * Setup redis store
   */
  load_redis_store() {
    // Initialize client.
    const redisClient = createClient({
      url: this.config.redis.url,
    });
    redisClient
      .on('error', (err) => console.log('Redis Client Error', err))
      .connect()
      .catch(console.error);

    // Initialize store.
    this.store = new RedisStore({
      client: redisClient,
      prefix: `${this.config.redis.prefix}`,
    });
  }

  //
  // KEYCLOAK
  //
  async initialize_keycloak_issuer() {
    // Fetch issuer information from Keycloak
    this.issuer = await Issuer.discover(this.config.keycloak.keycloak_issuer);
    return this.issuer;
  }

  initialize_keycloak_client() {
    // Setup Keycloak client using openid-client
    this.client = new this.issuer.Client({
      client_id: this.config.keycloak.keycloak_client_id,
      client_secret: this.config.keycloak.keycloak_client_secret,
      redirect_uris: this.config.keycloak.keycloak_redirect_uris.split(','),
      post_logout_redirect_uris: this.config.keycloak.keycloak_logout_redirect_uris.split(','),
      response_types: this.config.keycloak.keycloak_response_types.split(','),
    });

    // Hook to inject the access token, keycloak is different.
    // https://github.com/panva/node-openid-client/tree/main/docs#customizing-individual-http-requests
    // https://github.com/panva/node-openid-client/issues/211#issuecomment-558210891
    this.client[custom.http_options] = (url, options) => {
      if (
        url.href === this.issuer.token_endpoint &&
        options.form.access_token &&
        options.form.grant_type === 'urn:ietf:params:oauth:grant-type:uma-ticket'
      ) {
        const { access_token } = options.form;
        delete options.form.access_token;
        options.headers = options.headers || {};
        options.headers.Authorization = `Bearer ${access_token}`;
      }
      return options;
    };

    return this.client;
  }

  /**
   * Force to logout the user session
   * @param {Object} res express response
   * @param {String} idToken The latest id_token to logout the user session, it skips the keycloak UI doing so.
   * @returns redirect to logout redirect uri, if it is an array, this is not implemented.
   */
  force_logout(res, idToken) {
    return res.redirect(
      `${this.issuer.metadata.end_session_endpoint}?post_logout_redirect_uri=${encodeURIComponent(this.config.keycloak.keycloak_logout_redirect_uris)}&id_token_hint=${idToken}`
    );
  }

  //
  // PASSPORTJS
  //

  initialize_passport() {
    // Setup PassportJS and the session
    this.app.use(passport.authenticate('session'));

    // Setup PassportJS Strategy using OIDC and the Keycloak client
    // It stores only the tokenSet, the userInfo will be accessed through the tokenSet
    passport.use(
      'oidc',
      new Strategy({ client: this.client }, (tokenSet, _userInfo, done) => {
        // console.debug('OIDC', tokenSet, _userInfo);
        return done(null, tokenSet);
      })
    );

    /**
     * Receives a tokenSet
     */
    passport.serializeUser(function (token, done) {
      done(null, token);
    });
    /**
     * Returns an object with the userinfo and token
     */
    passport.deserializeUser(function (token, done) {
      done(null, { userinfo: new TokenSet(token).claims(), token });
    });

    return { app: this.app, passport };
  }

  is_authenticated() {
    return async (req, res, next) => {
      try {
        if (req.user.token) {
          const tokenSet = new TokenSet(req.user.token);
          const isAuth = await this.client.userinfo(tokenSet);
          return isAuth() ? next() : await this.refresh(req, res, next);
        }
        return res.redirect('/');
      } catch (_) {
        return this.refresh(req, res, next);
      }
    };
  }

  /**
   * Refresh the user access token using the refresh token
   * @param {Object} req requires the req.user.token.refresh_token
   * @param {Object} res express response
   * @param {Function} next express Next
   * @returns next() or sign out the user
   */
  refresh() {
    return async (req, res, next) => {
      try {
        // the user is connected, but might not be valid anymore.
        if (req.user) {
          // try to get a new tokenSet, but depending on the SSO Session Idle and Max in keycloak
          // It might be invalid
          const tokenSet = await this.client.refresh(req.user.token.refresh_token);
          req.session.passport.user = tokenSet;
          return req.session.save(function (err) {
            if (err) {
              throw new Error('Unable to refresh the token. You must sign in.');
            }
            req.user.token = req.session.passport.user;
            req.user.userinfo = tokenSet.claims();
            return next();
          });
        }

        throw new Error('Unable to refresh the token. You must sign in.');
      } catch (e) {
        const idToken = req.user.token.id_token;
        // Logout local session (passportJS session)
        return req.logout((err) => {
          if (err) {
            return next(err);
          }
          // Logout browser (Keycloak sign in page)
          // Not convince that it is the way to go...
          return this.force_logout(res, idToken);
        });
      }
    };
  }

  //
  // MIDDLEWARES
  //

  /**
   * Check Permission from the Authorization Server (AS)
   * It supports multiple format:
   * resource uri: `/uri/*` or `/uri/abc` and so on..
   * resource uri + scope: `/uri/*#create,view` or `/uri/abc#view` and so on..
   * @param {String} uri
   * @returns next() or not authorized
   */
  check_permission(uri) {
    return async (req, res, next) => {
      try {
        const response = await this.client.grant({
          grant_type: 'urn:ietf:params:oauth:grant-type:uma-ticket',
          audience: this.config.keycloak.keycloak_client_id,
          response_mode: this.config.keycloak.keycloak_response_mode,
          permission: uri,
          permission_resource_format: 'uri',
          permission_resource_matching_uri: true,
          access_token: req.user.token.access_token,
        });

        if (this.config.keycloak.keycloak_response_mode === 'decision') {
          if (response.result === true) {
            return next();
          }
        } else if (this.config.keycloak.keycloak_response_mode === 'permissions') {
          if (!response.error) {
            return next();
          }
        }
        return next(new Error(`Not authorized to access resource, ${response.error}`));
      } catch (e) {
        return next(new Error(`Not authorized to access resource, ${e.message}`));
      }
    };
  }

  /**
   * Check in the user group claim if the required group is present
   * @param {String} group Required group to access the resource
   * @returns next() or not authorized
   */
  check_group(group) {
    return async (req, res, next) => {
      if (req.user.userinfo.groups.includes(group)) {
        return next();
      }
      return next(new Error(`Not authorized to access resource, claim not found in expected group`));
    };
  }
}

module.exports = Auth;
