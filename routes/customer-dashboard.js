const express = require('express');
const request = require('request');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  request(`http://localhost:3000/api/status/all?api_key=${process.env.API_KEY}`, function (error, response, body) {
    res.locals.data = JSON.parse(body)
    console.log(res.locals.data)
    res.render('dashboard/index', {title: 'Express'});
  });
});

router.get('/interactive', (req, res, next) => {
  res.render('dashboard/interactive', {title: 'Express'});
});

module.exports = router;
