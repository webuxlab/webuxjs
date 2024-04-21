import express from 'express';
const router = express.Router();

router.get('/', function (req, res) {
  res.render('pages/home', { isAuthenticated: req.isAuthenticated() });
});

export default router;
