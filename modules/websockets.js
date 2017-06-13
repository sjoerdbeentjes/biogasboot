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
    parsedData.shift(); // Remove headers from arrays
    parsedData = parsedData.map(dataPoint => {
      dataPoint.Date = moment(`${dataPoint.Date} ${dataPoint.Time}`, 'DD-MM-YYYY h:mm:ss').format('YYYY-MM-DD h:mm:ss');

      // console.log(new Date(`${dataPoint.Date}T${dataPoint.Time}`))
      delete dataPoint.Time;
      return dataPoint
    })
    addFileToMongo(parsedData);
  });
}

function addFileToMongo(data) {
  dataPoint.insertMany(data)
    .then(mongooseDocuments => {})
    .catch(err => {
      console.log(err);
    });
}

//getFilesFromDirectory();

function webSockets(app, io) {
  fs.readFile('./data/sample-data.csv', (err, data) => {
    if (err) {
      throw err;
    }
    parse(data, {columns: ['Date', 'Time', 'PT100_real_1', 'PT100_real_2', 'Gaszak_hoogte_hu', 'ph_value', 'input_value', 'heater_status']}, (error, output) => {
      if (error) {
        throw error;
      }

      let i = 1;
      const sendItemsCount = 30;

      setInterval(() => {
        if (!output[i + sendItemsCount]) {
          i = 1;
        }

        const dataCollection = [];

        for (let x = 1; x <= sendItemsCount; x++) {
          dataCollection.push(output[x + i]);
        }

        i += 30;
        //console.log(output[i]);

        const tileStatus = tileSatus(output[i]);

        io.sockets.emit('dataPoint', dataCollection, tileStatus);
      }, 1000);
    });
  });
}

module.exports = webSockets;
