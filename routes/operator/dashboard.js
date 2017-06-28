const express = require('express');

const router = express.Router();

const User = require('../../models/user');

/* Operator | Dashboard */
router.get('/', (req, res, next) => {
  if (res.locals.user) {
    User.find((err, users) => {
      res.locals.isRealTime = true;
      res.render('operator/dashboard', {title: 'Operator | Dashboard'});
    });
  } else {
    res.status(404).render('login');
  }
});

module.exports = router;
