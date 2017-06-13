const fs = require('fs');
const path = require('path');
const JSFtp = require('jsftp');
const moment = require('moment');
const parse = require('csv-parse');

require('dotenv').config();
const dataPoint = require('../models/dataPoint');

const settingsFTP = {
  // Setup  connections to external FTP server
  host: process.env.FTP_SERVER,
  port: 21,
  user: process.env.FTP_USER,
  pass: process.env.FTP_PASS
};


module.exports.getValueFileNames = function () {
  new JSFtp(settingsFTP).ls('/uploads/VALUE/VALUE/', (err, res) => {
    const fileNames = res.map(fileData => {
      return fileData.name;
    });
    checkDirectoryForNewData(fileNames);
    checkLatestFileForNewData(fileNames[fileNames.length-1]);
  });
};

function checkLatestFileForNewData(file) {
  const formattedDate = moment(file.split('.')[0], 'YYMMDD');

  dataPoint.find({
    Date: {
      $gte: formattedDate.toDate(),
      $lt: formattedDate.add(1, 'days').toDate()
    }
  }, (err, dataForDate) => {
    console.log(dataForDate)
    if (dataForDate.length > 0) {
      console.log(dataForDate);
      console.log(dataForDate.length);
    }
  });
  // const formattedDate = moment(file.split('.')[0], 'YYMMDD').format('DD-MM-YYYY');
  // fs.readFile(path + file, (err, data) => {
  // if (err) throw err;
  // });
}

function checkDirectoryForNewData(files) {
  dataPoint.distinct('Date', (err, uniqueDates) => {

    if (err) throw err;
    uniqueDates = formatDates(uniqueDates);
    getFileData(findMissingDataFiles(uniqueDates, files));
  });
}

function formatDates(dates) {
  /**
   * format dates from DD-MM-YYYY to YYMMDD
   */
  const formattedDates = dates.map(date => {
    return moment(date, 'DD-MM-YYYY').format('YYMMDD');
  });
  return formattedDates.filter((item, i, ar) => {
    return ar.indexOf(item) === i;
  });
}

function findMissingDataFiles(uniqueDates, files) {
  // console.log(uniqueDates)
  /**
   * If unique dates does include the file don't filter it from files.
   */
  return files.filter(file => {
    return !uniqueDates.includes(file.split('.')[0]);
  });
}

function getFileData(files) {
  files.forEach(file => {
    downloadFTPFile(file);
  });
}

function downloadFTPFile(file) {
  new JSFtp(settingsFTP).get(`/uploads/VALUE/VALUE/${file}`, path.join(__dirname, `../data/ftp/VALUE/${file}`), hadErr => {
    if (hadErr)
      console.error(hadErr);
    else
      fs.readFile(path.join(__dirname, `../data/ftp/VALUE/${file}`), (err, data) => {
        if (err) throw err;
        parseFileDataToJSON(data);
        removeDownloadedFTPFile(file);
      });
  });
}

function removeDownloadedFTPFile(file) {
  fs.unlink(path.join(__dirname, `../data/ftp/VALUE/${file}`));
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
      return dataPoint;
    });
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
