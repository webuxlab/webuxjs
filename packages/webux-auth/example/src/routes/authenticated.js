import express from 'express';
import { isAuthenticated } from '../passport.js';
import { checkGroup, checkPermission } from '../keycloak.js';

const router = express.Router();

router.get('/profile', isAuthenticated, (req, res) => {
  console.debug("profile")
  console.log(req.user)
  res.render('pages/profile', {
    profile: req.user.userinfo,
    // expires_at: req.user.token.expires_at,
    // now: Math.ceil(new Date().getTime()/1000),
    // diff: Math.ceil(new Date().getTime()/1000) - parseInt(req.user.token.expires_at),
    isAuthenticated: req.isAuthenticated()
  });
});

router.get(
  '/api/secret',
  isAuthenticated,
  checkPermission('/api/secret/*'),
  (req, res) => {
    res.render('pages/secret', {
      isAuthenticated: req.isAuthenticated()
    });
  }
);

router.get(
  '/api/admin',
  isAuthenticated,
  checkGroup('Administrator'),
  (req, res) => {
    res.render('pages/admin', {
      isAuthenticated: req.isAuthenticated()
    });
  }
);

router.get(
  '/kitty',
  isAuthenticated,
  (req, res) => {
    res.render('pages/kitty', {
      isAuthenticated: req.isAuthenticated()
    });
  }
);

export default router;
