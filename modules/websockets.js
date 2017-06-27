const fs = require('fs');
const path = require('path');
const moment = require('moment');
require('dotenv').config();
const parse = require('csv-parse');
const config = require('./config');
const dataPoint = require('../models/dataPoint');

function webSokets(app, io) {
  dataPoint.find({},
    (err, dataPoints) => {
      let i = 1;
      const sendItemsCount = 30;

      setInterval(() => {
        if (!dataPoints[i + sendItemsCount]) {
          i = 1;
        }

        const dataCollection = [];

        for (let x = 1; x <= sendItemsCount; x++) {
          dataCollection.push(dataPoints[x + i]);
        }

        i += 30;

        io.sockets.emit('dataPoint', dataCollection, config.tileStatus(dataPoints[i]));
      }, 10000);
    });
}

module.exports = webSokets;
