const fs = require('fs');
const path = require('path');
const JSFtp = require('jsftp');
const moment = require('moment');
const parse = require('csv-parse');
const config = require('./config');

require('dotenv').config();

const FTP = module.exports = config.ftp();

const checkForNewFilesIn = function (directoryKey) {
  new JSFtp(FTP.setup).ls(FTP[directoryKey].directory, (err, res) => {
    const ftpFiles = res.map(dataPoint => dataPoint.name);
    syncFTPwithMongoDatabase(directoryKey, ftpFiles);
  });
};

module.exports.checkForNewFilesIn = checkForNewFilesIn;
module.exports.checkForNewLocalFiles = checkForNewLocalFiles;

function checkForNewLocalFiles(directoryKey) {
  fs.readdir(path.join(__dirname, FTP[directoryKey].downloadDir), (err, files) => {
    files.forEach(file => {
      fs.readFile(path.join(__dirname, `${FTP[directoryKey].downloadDir}${file}`), (err, data) => {
        if (err) throw err;
        console.log(path.join(__dirname, `${FTP[directoryKey].downloadDir}${file}`))
        parseFileDataToJSON(data, directoryKey);
      });
    });
  });
}

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
let indexForDownloading = 0;

function downloadMissingData(directoryKey, filesNotInMongo) {
  // Create directory if not exists
  if (!fs.existsSync(path.join(__dirname, `${FTP[directoryKey].downloadDir}`))) fs.mkdirSync(path.join(__dirname, `${FTP[directoryKey].downloadDir}`));
  console.log(indexForDownloading);
  indexForDownloading++;
  if (indexForDownloading < filesNotInMongo.length) {
    setTimeout(downloadMissingData(directoryKey, filesNotInMongo), 1000);
    console.log(filesNotInMongo[indexForDownloading])
  }

  // filesNotInMongo.forEach(file => {
  //   console.log(file)
  //   new JSFtp(FTP.setup).get(`${FTP[directoryKey].directory}${file}`, path.join(__dirname, `${FTP[directoryKey].downloadDir}${file}`), hadErr => {
  //     if (hadErr) console.log(hadErr);
  //     else
  //       fs.readFile(path.join(__dirname, `${FTP[directoryKey].downloadDir}${file}`), (err, data) => {
  //         if (err) throw err;
  //         parseFileDataToJSON(data, directoryKey);
  //         removeDownloadedFTPFile(file, directoryKey);
  //       });
  //   });
  // });
}

function removeDownloadedFTPFile(file, directoryKey) {
  fs.unlink(path.join(__dirname, `.${FTP[directoryKey].downloadDir}${file}`));
}

function parseFileDataToJSON(data, directoryKey) {
  parse(data, {
    delimiter: ';',
    columns: FTP[directoryKey].fileColumns
  }, (err, parsedData) => {
    if (err) throw err;
    parsedData.shift(); // Remove headers from arrays
    parsedData = parsedData.map(dataPoint => {
      dataPoint.Date = moment(`${dataPoint.Date} ${dataPoint.Time}`, 'DD/MM/YYYY HH:mm:ss').add(1, 'hours').format('YYYY-MM-DD HH:mm:ss');
      delete dataPoint.Time;
      return dataPoint;
    });
    addFileToMongo(parsedData, directoryKey);
  });
}

function addFileToMongo(data, directoryKey) {
  FTP[directoryKey].schema.insertMany(data)
    .then(mongooseDocuments => {})
    .catch(err => {
      console.log(err);
    });
}
