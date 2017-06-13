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

function filterData(format, date, data) {
  const returnData = [];
  const dataObject = {Date: new Date(Number(date) * 1000), 'Temp_PT100_1': 0, 'Temp_PT100_2': 0, pH_Value: 0, Bag_Height: 0, count: 0};
  const parsedDate = parseDate(new Date(Number(date) * 1000));
  data.forEach(function(point) {
    let thisDate = parseDate(point.Date);
    if(thisDate == parsedDate) {
      dataObject['Temp_PT100_1'] = dataObject['Temp_PT100_1'] + Number(point['Temp_PT100_1']);
      dataObject['Temp_PT100_2'] = dataObject['Temp_PT100_2'] + Number(point['Temp_PT100_2']);
      dataObject['pH_Value'] = dataObject['pH_Value'] + Number(point['pH_Value']);
      dataObject['Bag_Height'] = dataObject['Bag_Height'] + Number(point['Bag_Height']);
      dataObject['count'] = dataObject['count'] +  1;
    }
  });
  returnData.push(dataObject);
  return returnData;
}

function parseDate(date) {
  return `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;
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
      if(req.param('format') && req.param('date')) {
        const formattedData = filterData(req.param('format'), req.param('date'), data);
        res.send(formattedData);
      } else {
        res.send(data);
      }
    });
  }
});

module.exports = router;
