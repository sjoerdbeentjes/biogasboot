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
        res.locals.YMdropdown = result;
        res.render('operator/history', {title: 'Operator | Dashboard'});
    }
  });

});

module.exports = router;
