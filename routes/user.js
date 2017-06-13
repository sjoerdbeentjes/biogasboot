const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  if (res.locals.user && res.locals.user.role === 'admin') {
    res.render('user');
  } else {
    res.status(404).render('404');
  }
});

module.exports = router;
