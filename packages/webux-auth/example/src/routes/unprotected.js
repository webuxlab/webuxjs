import express from 'express';

const router = express.Router();

router.get('/', function (req, res) {
  console.log('req: ', req.isAuthenticated(), req.user);
  res.render('pages/home', { isAuthenticated: req.isAuthenticated() });
});

export default router;
