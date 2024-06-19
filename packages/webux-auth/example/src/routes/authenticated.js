import express from 'express';
import auth from '../auth.js';

const router = express.Router();

router.get('/profile', auth.is_authenticated(), (req, res) => {
  console.debug('profile');
  console.log(req.user.userinfo.sub);
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
  auth.is_authenticated(),
  auth.check_permission('/api/secret/*'),
  (req, res) => {
    res.render('pages/secret', {
      isAuthenticated: req.isAuthenticated()
    });
  }
);

router.get(
  '/api/admin',
  auth.is_authenticated(),
  auth.check_group('Administrator'),
  (req, res) => {
    res.render('pages/admin', {
      isAuthenticated: req.isAuthenticated()
    });
  }
);

router.get('/kitty', auth.is_authenticated(), (req, res) => {
  res.render('pages/kitty', {
    isAuthenticated: req.isAuthenticated()
  });
});

export default router;
