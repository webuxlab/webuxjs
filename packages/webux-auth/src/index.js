const expressSession = require('express-session');
const { Issuer, custom, Strategy, TokenSet } = require('openid-client');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');

class Auth {
  /**
   * Initialize the authentication module
   * @param {Object} opts
   * @param {Object} log Custom logger, by default: console
   * @returns {VoidFunction}
   */
  constructor(opts, log = console) {
    this.config = opts || {};
    this.log = log;

    this.store = undefined; // session
    this.issue = null;
    this.client = null;
    this.passport = passport;
  }

  //
  // SESSION
  //

  /**
   * Enable Express session with user selected store
   * @returns {any}
   */
  load_express_session() {
    return expressSession({
      secret: this.config.session.express_session_secret,
      resave: this.config.session.resave,
      saveUninitialized: this.config.session.save_uninitialized,
      store: this.store, // defaults to memoryStore
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
      .on('error', (err) => this.log.log('Redis Client Error', err))
      .connect()
      .catch(this.log.error);

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

  passport_session() {
    return this.passport.authenticate('session');
  }

  initialize_local_passport(login_function) {
    this.passport.use(new LocalStrategy(login_function));

    /**
     * Receives a USER from database
     */
    this.passport.serializeUser(function (user, done) {
      console.log('Serialize', user.id);
      done(null, user.id); // SHould only save the userId and fetch everytime from the database (or use a JWT token at this point ... will be implemented later on.)
    });

    /**
     * Returns the user info
     */
    this.passport.deserializeUser(function (user_id, done) {
      console.log('Deserialize', user_id);
      // TODO: fetch from DB...
      done(null, { username: 'tommy', email: 'tommy@studiowebux.com', id: '123' });
    });

    return { passport: this.passport };
  }

  initialize_passport() {
    return this.passport.initialize();
  }

  initialize_oidc_passport() {
    // Setup PassportJS Strategy using OIDC and the Keycloak client
    // It stores only the tokenSet, the userInfo will be accessed through the tokenSet
    this.passport.use(
      'oidc',
      new Strategy({ client: this.client }, (tokenSet, _userInfo, done) => {
        return done(null, tokenSet);
      })
    );

    /**
     * Receives a tokenSet
     */
    this.passport.serializeUser(function (token, done) {
      done(null, token);
    });
    /**
     * Returns an object with the userinfo and token
     */
    this.passport.deserializeUser(function (token, done) {
      done(null, { userinfo: new TokenSet(token).claims(), token });
    });

    return { passport: this.passport };
  }

  is_authenticated() {
    return async (req, res, next) => {
      try {
        if (req.user.token) {
          const tokenSet = new TokenSet(req.user.token);
          const isAuth = await this.client.userinfo(tokenSet);
          return isAuth ? next() : await this.refresh(req, res, next);
        }
        return res.redirect('/');
      } catch (e) {
        this.log.error(e.message);
        return this.refresh(req, res, next);
      }
    };
  }

  is_local_authenticated() {
    return async (req, res, next) => {
      console.log(req);
      console.debug('cookies', req.cookies);
      try {
        console.log('req.user', req.user);
        if (req.user && req.isAuthenticated()) {
          return next();
        }
        return res.redirect(this.config.local.redirect_url);
      } catch (e) {
        this.log.error(e.message);
        return next(e.message);
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
  async refresh(req, res, next) {
    this.log.debug('Trying to refresh');
    try {
      // the user is connected, but might not be valid anymore.
      if (req.user) {
        // try to get a new tokenSet, but depending on the SSO Session Idle and Max in keycloak
        // It might be invalid
        const tokenSet = await this.client.refresh(req.user.token.refresh_token);
        req.session.passport.user = tokenSet;
        return req.session.save(function (err) {
          if (err) {
            return next(new Error('Unable to refresh the token. You must sign in.'));
          }
          req.user.token = req.session.passport.user;
          req.user.userinfo = tokenSet.claims();

          this.log.debug('token refreshed');
          return next();
        });
      }

      throw new Error('Unable to refresh the token. You must sign in.');
    } catch (e) {
      this.log.error(e.message);
      const idToken = req?.user?.token?.id_token;

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

  // TODO: Add simple username/password
  // Nothing fancy, just a simple username/password in a postgresDB
  // Later on if needed we can add more features, but at this point using something keycloak is more than preferable.
  local_login() {
    return async (req, res, next) => {
      return this.passport.authenticate('local', function (err, user, info) {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.redirect('/login');
        }
        req.logIn(user, function (err) {
          if (err) {
            return next(err);
          }
          return res.redirect('/users/' + user.username);
        });
      })(req, res, next);
      // return this.passport.authenticate('local', (err, user, info, status) => {
      //   console.log(err, user, info, status);
      //   if (err) {
      //     return next(err);
      //   }
      //   if (!user) {
      //     this.log.debug('User not found.');
      //     return res.redirect(this.config.local.redirect_url);
      //   }

      //   // req.session.passport.user = user;
      //   // return req.session.save(function (err) {
      //   //   if (err) {
      //   //     return next(new Error('Unable to save information. You must login.'));
      //   //   }
      //   //   req.user.token = null;
      //   //   req.user.userinfo = user;

      //   //   this.log.debug('user session saved');
      //   //   return next();
      //   // });
      //   // res.redirect(this.config.local.redirect_home);
      //   return next();
      // })(req, res, next);
    };
  }
}

module.exports = Auth;
