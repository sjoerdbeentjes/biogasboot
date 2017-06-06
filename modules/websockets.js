const fs = require('fs');
const parse = require('csv-parse');

function webSokets(app, io) {
  fs.readFile('./data/sample-data.csv', (err, data) => {
    if (err) {
      throw err;
    }
    parse(data, {columns: ['Date', 'Time', 'PT100_real_1', 'PT100_real_2', 'Gaszak_hoogte_hu']}, (error, output) => {
      if (error) {
        throw error;
      }

      let i = 1;

      setInterval(() => {
        io.sockets.emit('dataPoint', output[i]);

        i++;
      }, 200);
    });
  });
}

module.exports = webSokets;
