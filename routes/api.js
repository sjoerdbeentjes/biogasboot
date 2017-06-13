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
    parse(data, {
      columns: ['Date', 'Time', 'PT100_real_1', 'PT100_real_2', 'Gaszak_hoogte_hu']
    }, (error, output) => {
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

// Function for getting the average value per day (UNIX timestamp as parameter in URL)
function filterData(format, date, data) {
  const returnData = [];
  // Create a new dataObject
  const dataObject = {
    Date: new Date(Number(date) * 1000),
    'Temp_PT100_1': 0,
    'Temp_PT100_2': 0,
    pH_Value: 0,
    Bag_Height: 0,
    count: 0
  };
  const parsedDate = parseDate(new Date(Number(date) * 1000));
  // Fill the dataObject with the data of that day
  data.forEach(function(point) {
    let thisDate = parseDate(point.Date);
    if (thisDate == parsedDate) {
      dataObject['Temp_PT100_1'] = dataObject['Temp_PT100_1'] + Number(point['Temp_PT100_1']);
      dataObject['Temp_PT100_2'] = dataObject['Temp_PT100_2'] + Number(point['Temp_PT100_2']);
      dataObject['pH_Value'] = dataObject['pH_Value'] + Number(point['pH_Value']);
      dataObject['Bag_Height'] = dataObject['Bag_Height'] + Number(point['Bag_Height']);
      dataObject['count'] = dataObject['count'] + 1;
    }
  });
  returnData.push(dataObject);
  return returnData;
}

// Parse the date for object Key name
function parseDate(date) {
  return `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;
}

/* GET home page. */
router.get('/all', (req, res, next) => {
  // Check for parameters and use them for serving data
  // console.log(req.param('format'))
  if (req.param('dateStart') && req.param('dateEnd')) {
    let filteredData = [];
    let averageObject = {};
    DataPoint.find((err, data) => {
      data.forEach(function(point) {
        const thisDate = new Date(point.Date);
        const startDate = new Date(Number(req.param('dateStart')) * 1000);
        const endDate = new Date(req.param('dateEnd') * 1000);
        // Check if the actual date is in between the start- & end date
        if (thisDate >= startDate && thisDate <= endDate) {
          // Check if the data has to be formatted
          if (req.param('format')) {
            const format = req.param('format');
            const date = parseDate(point.Date);
            // Check if the actual date has a instance in the averageObject allready
            if (averageObject[date]) {
              // Update de averageObject data with the actual data
              averageObject[date] = {
                Date: averageObject[date]['Date'],
                'Temp_PT100_1': Number(point['Temp_PT100_1']) + averageObject[date]['Temp_PT100_1'],
                'Temp_PT100_2': Number(point['Temp_PT100_2']) + averageObject[date]['Temp_PT100_2'],
                pH_Value: Number(point['pH_Value']) + averageObject[date]['pH_Value'],
                Bag_Height: Number(point['Bag_Height']) + averageObject[date]['Bag_Height'],
                count: + averageObject[date]['count'] + 1
              };
            } else {
              // If there is no instance in the averageObject yet, create one
              averageObject[date] = {
                Date: point.Date,
                'Temp_PT100_1': Number(point['Temp_PT100_1']),
                'Temp_PT100_2': Number(point['Temp_PT100_2']),
                pH_Value: Number(point['pH_Value']),
                Bag_Height: Number(point['Bag_Height']),
                count: 1
              };
            }
          } else {
            // Push the filtered data if there is no format option declared
            filteredData.push(point)
          }
        };
      });
      // Loop trough average values in averageObject and push to the filteredData array
      for(key in averageObject) {
        filteredData.push(averageObject[key])
      }
      res.send(filteredData)
    });
  } else {
    // uncomment this function if the sample data needs to be reset (first delete collection in database)
    // setData(req, res);
    // console.log(DataPoint)
    DataPoint.find((err, data) => {
      if (req.param('format') && req.param('date')) {
        const formattedData = filterData(req.param('format'), req.param('date'), data);
        res.send(formattedData);
      } else {
        res.send(data);
      }
    });
  }
});

module.exports = router;
