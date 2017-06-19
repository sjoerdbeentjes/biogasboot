const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  
  res.render('dashboard/index', {title: 'Express'});
});

router.get('/interactive', (req, res, next) => {
  res.render('dashboard/interactive', {title: 'Express'});
});

module.exports = router;
