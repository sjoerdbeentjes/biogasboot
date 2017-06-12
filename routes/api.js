const fs = require('fs');
const parse = require('csv-parse');
const express = require('express');

const DataPoint = require('../models/dataPoint');

const router = express.Router();

function setData(req, res) {
  fs.readFile('./data/sample-data.csv', (err, data) => {
    if (err) {
      throw err;
    }
    parse(data, {columns: ['Date', 'Time', 'PT100_real_1', 'PT100_real_2', 'Gaszak_hoogte_hu']}, (error, output) => {
      if (error) {
        throw error;
      }

      output.forEach(item => {
        const dataPoint = new DataPoint(item);

        dataPoint.save(err => {
          if (err) {
            throw err;
          }
        });
      });

      res.send(output);
    });
  });
}

/* GET home page. */
router.get('/all', (req, res, next) => {
  // Check for parameters and use them for serving data
  // console.log(req.param('format'))
  if(req.param('dateStart') && req.param('dateEnd')) {
    let filteredData = [];
    DataPoint.find((err, data) => {
      data.forEach(function(point) {
        const thisDate = new Date(point.Date);
        const startDate = new Date(Number(req.param('dateStart')) * 1000);
        const endDate = new Date(req.param('dateEnd') * 1000);
        if(thisDate >= startDate && thisDate <= endDate) {
          filteredData.push(point)
        };
      });
      res.send(filteredData)
    });
  } else {
    // uncomment this function if the sample data needs to be reset (first delete collection in database)
    // setData(req, res);
    // console.log(DataPoint)
    DataPoint.find((err, data) => {
      res.send(data);
    });
  }
});

module.exports = router;
