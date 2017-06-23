const fs = require('fs');
const path = require('path');
const moment = require('moment');
require('dotenv').config();
const parse = require('csv-parse');
const dataPoint = require('../models/dataPoint');
const tileStatus = require('./tile-status');

function webSokets(app, io) {
  dataPoint.find({
      Date: {
        $gte: moment('1484906400000', 'x').toDate(),
        $lt: moment('1484906400000', 'x').add('days', 6).toDate()
      }
    },
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

        io.sockets.emit('dataPoint', dataCollection, tileStatus(dataPoints[i]));
      }, 1000);
    });
}

module.exports = webSokets;
