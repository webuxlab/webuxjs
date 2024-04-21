import { Strategy, TokenSet } from 'openid-client';
import passport from 'passport';
import { client, forceLogout } from './keycloak.js';

/**
 * Initialize PassportJS
 * @param {Object} app ExpressJS Application
 * @param {Object} client Openid Client
 * @returns {app, passport}
 */
export function initPassport(app, client) {
  // Setup PassportJS and the session
  app.use(passport.authenticate('session'));

  // Setup PassportJS Strategy using OIDC and the Keycloak client
  // It stores only the tokenSet, the userInfo will be accessed through the tokenSet
  passport.use(
    'oidc',
    new Strategy({ client }, (tokenSet, _userInfo, done) => {
      // console.debug('OIDC', tokenSet, _userInfo);
      return done(null, tokenSet);
    })
  );

  /**
   * Receives a tokenSet
   */
  passport.serializeUser(function (token, done) {
    console.debug('SERIALIZE');
    done(null, token);
  });
  /**
   * Returns an object with the userinfo and token
   */
  passport.deserializeUser(function (token, done) {
    console.debug('DESERIALIZE');
    done(null, { userinfo: new TokenSet(token).claims(), token });
  });

  return { app, passport };
}

/**
 * Verify that the user token is valid
 * @param {Object} req requires the req.user.token
 * @param {Object} res
 * @param {Function} next
 * @returns next() or a redirection to /auth/login
 */
export async function isAuthenticated(req, res, next) {
  try {
    console.debug('isAuthenticated');
    if (req.user?.token) {
      const tokenSet = new TokenSet(req.user.token);
      const isAuth = await client.userinfo(tokenSet);
      return isAuth() ? next() : await refresh(req, res, next);
    }
    console.debug('nope');
    return res.redirect('/');
  } catch {
    console.debug('trying to refresh the access token');
    return await refresh(req, res, next);
  }
}

/**
 * Refresh the user access token using the refresh token
 * @param {Object} req requires the req.user.token.refresh_token
 * @param {Object} res
 * @param {Function} next
 * @returns next() or sign out the user
 */
export async function refresh(req, res, next) {
  try {
    console.debug('refresh token');
    // the user is connected, but might not be valid anymore.
    if (req.user) {
      // try to get a new tokenSet, but depending on the SSO Session Idle and Max in keycloak
      // It might be invalid
      const tokenSet = await client.refresh(req.user.token.refresh_token);
      req.session.passport.user = tokenSet;
      return req.session.save(function (err) {
        if (err) {
          throw new Error('Unable to refresh the token. You must sign in.');
        }
        req.user.token = req.session.passport.user;
        req.user.userinfo = tokenSet.claims();
        console.debug('token refreshed');
        return next();
      });
    }

    throw new Error('Unable to refresh the token. You must sign in.');
  } catch (e) {
    console.error(e.message);
    console.debug('Unable to refresh');
    const idToken = req.user.token.id_token;
    // Logout local session (passportJS session)
    return req.logout((err) => {
      console.error('Logout called');
      if (err) {
        console.debug('err', err);
        return next(err);
      }
      // Logout browser (Keycloak sign in page)
      // Not convince that it is the way to go...
      return forceLogout(res, idToken);
    });
  }
}
