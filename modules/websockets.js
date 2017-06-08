const fs = require('fs');
const parse = require('csv-parse');

function tileSatus(data) {
  // values when attention is required or not.
  const statusData = {
    phStatus: 0,
    tempStatus: 0,
    gasbagStatus: 0,
    inputStatus: 0
  };
  const types = {
    ph: {
      low: 7,
      high: 8,
      warningLow: 5,
      warningHigh: 6
    },
    temp: {
      low: 34,
      high: 38,
      warningLow: 35,
      warningHigh: 36
    },
    gasbag: {
      low: 50,
      high: 150,
      warningLow: 50,
      warningHigh: 120
    },
    input: {
      low: 10,
      high: 150,
      warningLow: 10,
      warningHigh: 40
    }
  };
  // Explain number meanings
  // 0 = Good
  // 1 = Warning
  // 2 = Error
  switch (true) {
    case data.ph_value >= types.ph.low && data.ph_value <= types.ph.high:
      // Good
      statusData.phStatus = 0;
      break;
    case data.ph_value >= types.ph.warningLow && data.ph_value <= types.ph.warningHigh :
      // Warning
      statusData.phStatus = 1;
      break;
    case data.ph_value < types.ph.low && data.ph_value > types.ph.high:
      // Error
      statusData.phStatus = 2;
      break;
    default:
      statusData.phStatus = 0;
      break;
  }

  return statusData;
}

function webSokets(app, io) {
  fs.readFile('./data/sample-data.csv', (err, data) => {
    if (err) {
      throw err;
    }
    parse(data, {columns: ['Date', 'Time', 'PT100_real_1', 'PT100_real_2', 'Gaszak_hoogte_hu', 'ph_value', 'input_value', 'heater_status']}, (error, output) => {
      if (error) {
        throw error;
      }

      let i = 1;

      setInterval(() => {
        if (!output[i]) {
          i = 1;
        }
        const tileStatus = tileSatus(output[i]);
        io.sockets.emit('dataPoint', output[i], tileStatus);

        i++;
      }, 1000);
    });
  });
}

module.exports = webSokets;
