const fs = require('fs');
const path = require('path');
const JSFtp = require('jsftp');
const moment = require('moment');
const parse = require('csv-parse');
const config = require('./config');

require('dotenv').config();

const FTP = module.exports = config.ftp();

function syncFTPwithMongoDatabase(directoryKey, ftpFiles) {
  FTP[directoryKey].schema.distinct('Date', (err, date) => {
    if (err) throw err;
    date = date.map(date => {
      return moment(date, 'DD-MM-YYYY').format('YYMMDD');
    });
    const uniqueDates = date.filter((date, index, array) => {
      return array.indexOf(date) === index;
    });
    const filesNotInMongo = compareFTPDatesWithMongo(uniqueDates, ftpFiles);
    downloadMissingData(directoryKey, filesNotInMongo);
  });
}

function compareFTPDatesWithMongo(datesInMongo, ftpFiles) {
  /**
   * If unique dates does include the file don't filter it from files.
   */
  return ftpFiles.filter(file => {
    return !datesInMongo.includes(file.split('.')[0]);
  });
}

function downloadMissingData(directoryKey, filesNotInMongo) {
  // Create directory if not exists
  if (!fs.existsSync(path.join(__dirname, `${FTP[directoryKey].downloadDir}`))) fs.mkdirSync(path.join(__dirname, `${FTP[directoryKey].downloadDir}`));
  filesNotInMongo.forEach(file => {
    new JSFtp(FTP.setup).get(`${FTP[directoryKey].directory}${file}`, path.join(__dirname, `${FTP[directoryKey].downloadDir}${file}`), hadErr => {
      if (hadErr) console.error(hadErr);
      else
        fs.readFile(path.join(__dirname, `${FTP[directoryKey].downloadDir}${file}`), (err, data) => {
          if (err) throw err;
          parseFileDataToJSON(data, directoryKey);
          removeDownloadedFTPFile(file, directoryKey);
        });
    });
  });
}

function removeDownloadedFTPFile(file, directoryKey) {
  fs.unlink(path.join(__dirname, `.${FTP[directoryKey].downloadDir}${file}`));
}

function parseFileDataToJSON(data, directoryKey) {
  parse(data, {
    columns: FTP[directoryKey].fileColumns
  }, (err, parsedData) => {
    if (err) throw err;
    parsedData.shift(); // Remove headers from arrays
    parsedData = parsedData.map(dataPoint => {
      dataPoint.Date = moment(`${dataPoint.Date} ${dataPoint.Time}`, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
      delete dataPoint.Time;
      return dataPoint;
    });
    addFileToMongo(parsedData, directoryKey);
  });
}

function addFileToMongo(data, directoryKey) {
  FTP[directoryKey].schema.insertMany(data)
    .then(mongooseDocuments => {})
    .catch(err => {console.log(err)});
}
