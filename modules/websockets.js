const fs = require('fs');
const path = require('path');
require('dotenv').config();
const moment = require('moment');

const parse = require('csv-parse');
const dataPoint = require('../models/dataPoint');
const tileStatus = require('./tile-status');

let latestFile;


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
    parse(data, {columns: ['Date', 'Time', 'PT100_real_1', 'PT100_real_2', 'Bag_Height', 'ph_value', 'input_value', 'heater_status']}, (error, output) => {
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

        io.sockets.emit('dataPoint', dataCollection, tileStatus(output[i]));
      }, 1000);
    });
  });
}

module.exports = webSockets;
