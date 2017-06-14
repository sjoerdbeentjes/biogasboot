const express = require('express');

const router = express.Router();

const User = require('../models/user');

/* GET home page. */
router.get('/', (req, res) => {
  if (res.locals.user && res.locals.user.role === 'admin') {
    res.render('user');
  } else {
    res.status(404).render('404');
  }
});

router.post('/bag-height', (req, res) => {
  const value = Number(req.body['bag-height']);

  console.log(res.locals.user.username, value);

  User.update({
    username: res.locals.user.username
  }, {
    $set: {
      warningValue: value
    }
  });

  res.redirect('/user');
});

module.exports = router;
