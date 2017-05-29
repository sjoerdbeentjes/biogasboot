const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', ensureAuthenticated, (req, res, next) => {
  res.render('index', {title: 'Express'});
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/users/login');
  }
}

module.exports = router;
