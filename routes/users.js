const express = require('express');

const router = express.Router();

const User = require('../models/user');

/* GET home page. */
router.get('/', (req, res, next) => {
  if (res.locals.user && res.locals.user.role === 'admin') {
    User.find((err, users) => {
      res.locals.users = users;
      console.log(res.locals.users);
      res.render('users');
    });
  } else {
    res.status(404).render('404');
  }
});

module.exports = router;
