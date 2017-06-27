const express = require('express');

const router = express.Router();

const User = require('../../models/user');
const dataPoint = require('../../models/dataPoint');

/* Operator | Dashboard */
router.get('/', (req, res, next) => {
  dataPoint.aggregate([
    {$project : {
      year : {$year : "$Date"},
      month : {$month : "$Date"},
    }},
    {$group : {
      _id : {year : "$year",month : "$month"}
    }},
    { $sort: {'_id.year':1, '_id.month':1} }
  ], (err, result) => {
    if (err) {
      console.log(err);
    } else {
        // Get years
        let years = [];
        for (let i = 0; i < result.length; i++) {
          // Only adds to years when not exist to prevent duplicates
          years.indexOf(result[i]._id.year) === -1 ? years.push(result[i]._id.year): years;
        }
        // Get months
        let months = [];
        for (let i = 0; i < result.length; i++) {
          // Only adds to months when not exist to prevent duplicates
          months.indexOf(result[i]._id.month) === -1 ? months.push(result[i]._id.month): months;
        }
        // Init month names
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        res.locals.dorpdownYears = years;
        res.locals.dorpdownMonths = months;
        res.locals.dorpdownMonthNames = monthNames;
        res.render('operator/history', {title: 'Operator | Dashboard'});
    }
  });

});

module.exports = router;
