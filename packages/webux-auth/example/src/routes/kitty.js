const express = require('express');
const auth = require('../auth');

const router = express.Router();
router.post(
  '/api/kitty',
  auth.is_authenticated(),
  auth.check_permission('/api/kitty/*#create'),
  (req, res, next) => {
    console.log('Create new Kitty');
    res.send('New Kitty added !');
  }
);

router.put(
  '/api/kitty/:id',
  auth.is_authenticated(),
  auth.check_permission('/api/kitty/*#update'),
  (req, res, next) => {
    console.log('Update existing Kitty');
    res.send('Kitty 1 updated !');
  }
);
router.delete(
  '/api/kitty/:id',
  auth.is_authenticated(),
  auth.check_permission('/api/kitty/*#delete'), // this: /api/kitty/*#delete,view act as a OR.
  (req, res, next) => {
    console.log('Kitty adopted !');
    res.send('Kitty 1 adopted !');
  }
);

router.get(
  '/api/kitty',
  auth.is_authenticated(),
  auth.check_permission('/api/kitty/*#view'),
  (req, res) => {
    console.log('List all Kitties');
    res.send('A bunch of kitties !');
  }
);
module.exports = router;
