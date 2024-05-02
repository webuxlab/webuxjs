const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
  console.log('req: ', req.isAuthenticated(), req.user);
  res.render('pages/home', { isAuthenticated: req.isAuthenticated() });
});

module.exports = router;