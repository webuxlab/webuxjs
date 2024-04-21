import express from 'express';
import { client } from '../keycloak.js';

const router = express.Router();

export default function routes(passport) {
  router.get('/auth/callback', (req, res, next) => {
    console.debug('/auth/callback');

    passport.authenticate('oidc', {
      successRedirect: '/profile',
      failureRedirect: '/'
    })(req, res, next);
  });

  router.get('/auth/logout/callback', (req, res) => {
    console.debug('/auth/logout/callback');
    req.logout(() => res.redirect('/'));
  });

  router.get('/auth/logout', (_req, res) => {
    console.debug('/auth/logout');
    res.redirect(client.endSessionUrl());
  });

  router.get('/auth/login', (req, res, next) => {
    console.debug('/auth/login');
    passport.authenticate('oidc')(req, res, next);
  });

  router.get('/not-logged-in', (req, res) => {
    console.debug('/not-logged-in');
    if (req.isAuthenticated()) return res.redirect('/');
    res.render('pages/not-logged-in', {
      isAuthenticated: req.isAuthenticated()
    });
  });

  return router;
}
