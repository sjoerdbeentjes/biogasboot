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



// // Gets latest file from FTP server and place it on this server (every 30 min, 1800 seconds)
// console.log('-----New update from FTP server-----');
// // Update VALUE dir
// ftpValue.ls('/uploads/VALUE/VALUE/', (err, res) => {
//   // Log error
//   if (err) {
//     console.log(err);
//   }
//   // Sort by filename
//   const byName = res.slice(0);
//   byName.sort((a, b) => a.name - b.name);

//   // Get latest file name (by name)
//   const totalFilesVALUE = byName.length - 1;
//   const latestFileVALUE = byName[totalFilesVALUE].name;
//   // Copy latest from FTP to this server
// ftpValue.get(`/uploads/VALUE/VALUE/${latestFileVALUE}`, path.join(__dirname, `../data/ftp/VALUE/${latestFileVALUE}`), hadErr => {
//   if (hadErr)
//     console.error(hadErr);
//   else
//     console.log('VALUE file copied successfully! Filename: ' + latestFileVALUE);
// });
// });

// // Update STATUS dir
// ftpStatus.ls('/uploads/STATUS/STATUS/', (err, res) => {
//   // Log error
//   if (err) {
//     console.log(err);
//   }
//   // Sort by filename
//   const byName = res.slice(0);
//   byName.sort((a, b) => a.name - b.name);

//   // Get latest file name (by name)
//   const totalFilesSTATUS = byName.length - 1;
//   const latestFileSTATUS = byName[totalFilesSTATUS].name;
//   // Copy latest from FTP to this server
//   ftpStatus.get(`/uploads/STATUS/STATUS/${latestFileSTATUS}`, path.join(__dirname, `../data/ftp/STATUS/${latestFileSTATUS}`), hadErr => {
//     if (hadErr)
//       console.error(hadErr);
//     else
//       console.log('STATUS file copied successfully! Filename: ' + latestFileSTATUS);
//   });
// });

// // // Update ALARM dir
// ftpAlarm.ls('/uploads/ALARM/', (err, res) => {
//   // Log error
//   if (err) {
//     console.log(err);
//   }
//   // Sort by timestamp
//   const byDate = res.slice(0);
//   byDate.sort((a, b) => a.time - b.time);

//   // Get latest file name
//   const totalFilesALARM = byDate.length - 1;
//   const latestFileALARM = byDate[totalFilesALARM].name;
//   // Copy latest from FTP to this server
//   ftpAlarm.get(`/uploads/ALARM/${latestFileALARM}`, path.join(__dirname, `../data/ftp/ALARM/${latestFileALARM}`), hadErr => {
//     if (hadErr)
//       console.error(hadErr);
//     else
//       console.log('ALARM file copied successfully! Filename: ' + latestFileALARM);
//   });
// });
// };

module.exports.getValueFileNames = function () {
  new JSFtp(settingsFTP).ls('/uploads/VALUE/VALUE/', (err, res) => {
    const fileNames = [];
    res.map(fileData => {
      fileNames.push(fileData.name);
    });
    // checkDirectoryForNewData(fileNames);
    checkLatestFileForNewData(fileNames.splice(-1)[0]);
  });
};

function checkLatestFileForNewData(file) {
  const formattedDate = moment(file.split('.')[0], 'YYMMDD');
  console.log(formattedDate);
  dataPoint.find({
    Date: {
      $gte: formattedDate.toDate(),
      $lt: formattedDate.add(1, 'days').toDate()
    }
  }, (err, data) => {
    console.log(data.length);
    console.log(err);
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
  return dates.map(date => {
    return moment(date, 'DD-MM-YYYY').format('YYMMDD');
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
