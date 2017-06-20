const fs = require('fs');
const path = require('path');
const JSFtp = require('jsftp');
const moment = require('moment');
const parse = require('csv-parse');

require('dotenv').config();

const FTP = module.exports = {
  setup: {
    host: process.env.FTP_SERVER,
    port: 21,
    user: process.env.FTP_USER,
    pass: process.env.FTP_PASS
  },
  value: {
    directory: '/uploads/VALUE/VALUE/',
    downloadDir: '../data/ftp/VALUE/',
    schema: require('../models/dataPoint'),
    fileColumns: ['Date', 'Time', 'Temp_PT100_1', 'Temp_PT100_2', 'pH_Value', 'Bag_Height']
  },
  status: {
    directory: '/uploads/STATUS/STATUS/',
    downloadDir: '../data/ftp/STATUS/',
    schema: require('../models/statusPoint'),
    fileColumns: ['Date', 'Time', 'Storagetank_Mixe', 'Storagetank_Feed', 'Digester_Mixer', 'Digester_Heater_1', 'Digester_Heater_2', 'Gaspump', 'Mode_Stop', 'Mode_Manual', 'Mode_Auto', 'System_Started', 'Additive_Pump']

  },
  // alarm: {
  //   directory: '/uploads/ALARM/',
  //   downloadDir: '../data/ftp/ALARM/',
  //   schema: require('../models/dataPoint'),
  //   fileColumns: ['Date','Time', 'Event', 'Group', 'AlarmName']
  // },
  checkForNewFilesIn(directoryKey) {
    new JSFtp(this.setup).ls(this[directoryKey].directory, (err, res) => {
      const ftpFiles = res.map(dataPoint => dataPoint.name);
      syncFTPwithMongoDatabase(directoryKey, ftpFiles);
    });
  },
  checkForNewLocalFiles(directoryKey) {
    fs.readdir(path.join(__dirname, this[directoryKey].downloadDir), (err, files) => {
      files.forEach(file => {
        fs.readFile(path.join(__dirname, `${this[directoryKey].downloadDir}${file}`), (err, data) => {
          if (err) throw err;
          console.log(path.join(__dirname, `${this[directoryKey].downloadDir}${file}`))
          parseFileDataToJSON(data, directoryKey);
        });
      });
    });
  }
};

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
    })
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
    .catch(err => {});
}
