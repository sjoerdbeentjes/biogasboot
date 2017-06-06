const express = require('express');

const router = express.Router();

const User = require('../../models/user');

/* Operator | Dashboard */
router.get('/', (req, res, next) => {
  // if (res.locals.user) {
  //   User.find((err, users) => {
  //     // res.locals.users = users;
  //     // console.log(res.locals.users);
  //     res.render('operator/dashboard', {title: 'Operator | Dashboard'});
  //   });
  // } else {
  //   res.status(404).render('404');
  // }
  res.render('operator/dashboard', {title: 'Operator | Dashboard'});
});

module.exports = router;
