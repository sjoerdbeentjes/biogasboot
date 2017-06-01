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
  // uncomment this function if the sample data needs to be reset (first delete collection in database)
  // setData(req, res);

  DataPoint.find((err, data) => {
    res.send(data);
  });
});

module.exports = router;
