const fs = require('fs');
const path = require('path');
require('dotenv').config();
const parse = require('csv-parse');

const dataPoint = require('../models/dataPoint');
const ftp = require('./get-files-ftp');



function tileSatus(data) {
  // values when attention is required or not.
  const statusData = {
    phStatus: 0,
    tempStatus: 0,
    gasbagStatus: 0
  };
  // Define low and high values for indicator, optional: min and max
  const types = {
    ph: {
      low: 7,
      high: 7.5,
      min: 1,
      max: 14
    },
    temp: {
      low: 34.6,
      high: 38
    },
    gasbag: {
      low: 145,
      high: 160,
      min: 10,
      max: 200
    }
  };
  // Explain number meanings
  // 0 = Good
  // 1 = Error
  // Gasbag indicator
  switch (true) {
    case data.Gaszak_hoogte_hu >= types.gasbag.low && data.Gaszak_hoogte_hu <= types.gasbag.high:
      // Good
      statusData.gasbagStatus = 0;
      break;
    case data.Gaszak_hoogte_hu > types.gasbag.high:
      // ADD NOTIFICATION FUNCTION HERE
      // Error + bag is almost full
      statusData.gasbagStatus = 1;
      break;
    case data.Gaszak_hoogte_hu < types.gasbag.low:
      // ADD NOTIFICATION FUNCTION HERE
      // Error + bag is almost empty
      statusData.gasbagStatus = 1;
      break;
    default:
      statusData.gasbagStatus = 0;
      break;
  }
  // PH indicator
  switch (true) {
    case data.ph_value >= types.ph.low && data.ph_value <= types.ph.high:
      // Good
      statusData.phStatus = 0;
      break;
    case data.ph_value > types.ph.high:
      // Error + ph to high
      statusData.phStatus = 1;
      break;
    case data.ph_value < types.ph.low:
      // Error + bag to low
      statusData.phStatus = 1;
      break;
    default:
      statusData.phStatus = 0;
      break;
  }
  // Temp indicator
  switch (true) {
    case data.PT100_real_1 >= types.temp.low && data.PT100_real_1 <= types.temp.high:
      // Good
      statusData.tempStatus = 0;
      break;
    case data.PT100_real_1 > types.temp.high:
      // Error + temp to high
      statusData.tempStatus = 1;
      break;
    case data.PT100_real_1 < types.temp.low:
      // Error + temp to low
      statusData.tempStatus = 1;
      break;
    default:
      statusData.tempStatus = 0;
      break;
  }

  return statusData;
}

function getValueFilesFromFTP() {
  const files = ftp.getValueFileNames();
  // checkDirectoryForNewData(files);
  // checkLatestFileForNewData(directoryPath, files.splice(-1)[0]); // Splice array get last item
}






getValueFilesFromFTP();

function webSokets(app, io) {
  fs.readFile('./data/sample-data.csv', (err, data) => {
    if (err) {
      throw err;
    }
    parse(data, {columns: ['Date', 'Time', 'PT100_real_1', 'PT100_real_2', 'Gaszak_hoogte_hu', 'ph_value', 'input_value', 'heater_status']}, (error, output) => {
      if (error) {
        throw error;
      }

      let i = 1;

      // setInterval(() => {
      //   if (!output[i]) {
      //     i = 1;
      //   }
      //   const tileStatus = tileSatus(output[i]);

      //   io.sockets.emit('dataPoint', dataCollection, tileStatus);
      // }, 1000);
    });
  });
}

module.exports = webSokets;
