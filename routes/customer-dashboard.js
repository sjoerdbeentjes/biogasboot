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
  const url = 'http://localhost:3000/api/range/average?dateStart=';
  const startDate = Date.parse("01-Jan-2017 08:00:00") / 1000
  const actualDate = Date.parse("01-May-2017 08:00:00") / 1000
  request(`${url}${startDate}&dateEnd=${actualDate}&api_key=${process.env.API_KEY}`, function (error, response, body) {
    res.locals.data = JSON.parse(body)
    res.send(res.locals.data)
    //res.render('dashboard/interactive', {title: 'Express'});
  });
});

module.exports = router;
