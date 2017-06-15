const fs = require('fs');
const path = require('path');
require('dotenv').config();
const parse = require('csv-parse');

const dataPoint = require('../models/dataPoint');
const tileStatus = require('./tile-status');
const ftp = require('./get-files-ftp');



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

module.exports = webSokets;
