const fs = require('fs');
const path = require('path');
const JSFtp = require('jsftp');
const moment = require('moment');
const parse = require('csv-parse');

require('dotenv').config();
const dataPoint = require('../models/dataPoint');
const alarm = require('../models/alarm');
// const dataPoint = require('../models/dataPoint');

const FTP = module.exports = {
  setup: {
    host: process.env.FTP_SERVER,
    port: 21,
    user: process.env.FTP_USER,
    pass: process.env.FTP_PASS
  },
  valueDirectory: '/uploads/VALUE/VALUE/',      // 1
  statusDirectory: '/uploads/STATUS/STATUS/',   // 2
  alarmDirectory: '/uploads/ALARM/',            // 3
  checkForNewFilesIn(directory, directoryKey) {
    let filesInDirectory;
    let filesInMongo;
    new JSFtp(this.setup).ls(directory, (err, res) => {
      filesInDirectory = res.map(dataPoint => dataPoint.name);
      switch (directoryKey) {
        case 1:
          console.log('value');
          console.log(directory, directoryKey);
          getUniqueDates(dataPoint);
          break;
        case 2:
          console.log('status');
          console.log(directory, directoryKey);
          break;
        case 3:
          console.log('alarm');
          console.log(directory, directoryKey);
          break;
        default:
          break;
      }
    });
  },
  readFileFrom: () => {}
};

function getUniqueDates(schema) {
  schema.distinct('Date', (err, uniqueDates) => {
    if (err) throw err;
    console.log(uniqueDates);
  });
}