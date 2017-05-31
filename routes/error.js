const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  if (req.accepts('html')) {
    res.render('404', {url: req.url});
  } else if (req.accepts('json')) {
    res.send({error: 'Not found'});
  } else {
    res.type('txt').send('Not found');
  }
});

module.exports = router;
