const fs = require('fs');
const path = require('path');
require('dotenv').config();
const moment = require('moment');

const parse = require('csv-parse');
const dataPoint = require('../models/dataPoint');

let latestFile;

function tileSatus(data) {
  // values when attention is required or not.
  const statusData = {
    phStatus: 0,
    tempStatus: 0,
    gasbagStatus: 0,
    inputStatus: 0
  };
  const types = {
    ph: {
      low: 7,
      high: 8,
      warningLow: 5,
      warningHigh: 6
    },
    temp: {
      low: 34,
      high: 38,
      warningLow: 35,
      warningHigh: 36
    },
    gasbag: {
      low: 50,
      high: 150,
      warningLow: 50,
      warningHigh: 120
    },
    input: {
      low: 10,
      high: 150,
      warningLow: 10,
      warningHigh: 40
    }
  };
  // Explain number meanings
  // 0 = Good
  // 1 = Warning
  // 2 = Error
  switch (true) {
    case data.ph_value >= types.ph.low && data.ph_value <= types.ph.high:
      // Good
      statusData.phStatus = 0;
      break;
    case data.ph_value >= types.ph.warningLow && data.ph_value <= types.ph.warningHigh:
      // Warning
      statusData.phStatus = 1;
      break;
    case data.ph_value < types.ph.low && data.ph_value > types.ph.high:
      // Error
      statusData.phStatus = 2;
      break;
    default:
      statusData.phStatus = 0;
      break;
  }

  return statusData;
}

function getFilesFromDirectory() {
  const directoryPath = path.join(__dirname, '../data/sd-card/VALUE/VALUE/');
  fs.readdir(directoryPath, (err, files) => {
    if (err) throw err;
    checkDirectoryForNewData(directoryPath, files);
    checkLatestFileForNewData(directoryPath, files.splice(-1)[0]); // Splice array get last item
  });
}

function checkLatestFileForNewData(path, file) {
  const formattedDate = moment(file.split('.')[0], 'YYMMDD').format('DD-MM-YYYY');
  console.log(formattedDate);
  fs.readFile(path + file, (err, data) => {
    if (err) throw err;
    console.log(data);
  });
}

function checkDirectoryForNewData(path, files) {
  dataPoint.distinct('Date', (err, uniqueDates) => {
    if (err) throw err;
    uniqueDates = formatDates(uniqueDates);
    getFileData(path, findMissingDataFiles(uniqueDates, files));
  });
}

function findMissingDataFiles(uniqueDates, files) {
  /**
   * If unique dates does include the file don't filter it from files.
   */
  return files.filter(file => {
    return !uniqueDates.includes(file.split('.')[0]);
  });
}

function formatDates(dates) {
  /**
   * format dates from DD-MM-YYYY to YYMMDD
   */
  return dates.map(date => {
    return moment(date, 'DD-MM-YYYY').format('YYMMDD');
  });
}

function getFileData(path, files) {
  files.forEach(file => {
    fs.readFile(path + file, (err, data) => {
      if (err) throw err;
      parseFileDataToJSON(data);
    });
  });
}

function parseFileDataToJSON(data) {
  parse(data, {
    columns: ['Date', 'Time', 'Temp_PT100_1', 'Temp_PT100_2', 'pH_Value', 'Bag_Height']
  }, (err, parsedData) => {
    if (err) throw err;
    addFileToMongo(parsedData);
  });
}

function addFileToMongo(data) {
  data.shift(); // Remove headers from arrays
  dataPoint.insertMany(data)
    .then(mongooseDocuments => {})
    .catch(err => {
      console.log(err);
    });
}

getFilesFromDirectory();

function webSokets(app, io) {
  fs.readFile('./data/sample-data.csv', (err, data) => {
    if (err) {
      throw err;
    }
    parse(data, {
      columns: ['Date', 'Time', 'PT100_real_1', 'PT100_real_2', 'Gaszak_hoogte_hu', 'ph_value', 'input_value', 'heater_status']
    }, (error, output) => {
      if (error) {
        throw error;
      }
      let i = 1;

      setInterval(() => {
        if (!output[i]) {
          i = 1;
        }
        const tileStatus = tileSatus(output[i]);
        io.sockets.emit('dataPoint', output[i], tileStatus);

        i++;
      }, 1000);
    });
  });
}

module.exports = webSokets;
