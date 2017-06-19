const fs = require('fs');
const path = require('path');
const parse = require('csv-parse');
const moment = require('moment');

function usageCalculation() {
  // (watt * hours) * price = costs
  // watt == Joules per second
  // Get the total 1's from a device, this means that it's on.
  // Every 1 stands for 1 minute of operation
  // Total 1's / 60 = total hours of operation
  // Total hours of operation * watt = usage

  /*

   Mixer:  180 W
   Heaters: elk 2000 W;
   Feed pomp: 550 W
   Blower:  210 W

   */

  let deviceCollection = {
    Storagetank_Mixe: {
      timeON: 0,
      watts: 180
    },
    Storagetank_Feed: {
      timeON: 0,
      watts: 210
    },
    Digester_Mixer: {
      timeON: 0,
      watts: 0
    },
    Digester_Heater_1: {
      timeON: 0,
      watts: 2000
    },
    Digester_Heater_2: {
      timeON: 0,
      watts: 2000
    },
    Gaspump: {
      timeON: 0,
      watts: 550
    },
    Mode_Stop: {
      timeON: 0,
      watts: 0
    },
    Mode_Manual: {
      timeON: 0,
      watts: 0
    },
    Mode_Auto: {
      timeON: 0,
      watts: 0
    },
    System_Started: {
      timeON: 0,
      watts: 0
    },
    Additive_Pump: {
      timeON: 0,
      watts: 0
    }
  };

  fs.readFile('./data/test-status.csv', (err, data) => {
    if (err) {
      throw err;
    }
    parse(data, {columns: ['Date','Time','Storagetank_Mixe','Storagetank_Feed','Digester_Mixer','Digester_Heater_1','Digester_Heater_2','Gaspump','Mode_Stop','Mode_Manual','Mode_Auto','System_Started','Additive_Pump']}, (error, output) => {
      if (error) {
        throw error;
      }

      let i = 0;
      const sendItemsCount = 1;

      setInterval(() => {
        if (!output[i + sendItemsCount]) {
          i = 1;
        }

        const dataCollection = [];

        for (let x = 1; x <= sendItemsCount; x++) {
          dataCollection.push(output[x + i]);
        }

        i += 1;
        // Unix time in seconds
        let currentTime = moment(output[i].Date + ' ' + output[i].Time, 'YYYY-MM-DD HH:mm:ss').valueOf() / 1000;
        let beforeTime  = moment(output[i - 1].Date + ' ' + output[i - 1].Time, 'YYYY-MM-DD HH:mm:ss').valueOf() / 1000;
        // Adds seconds to
        Object.keys(output[i]).forEach(function(key) {
          let valNumberBefore = Number(output[i - 1][key]);
          if (valNumberBefore === 1) {
            // Addeds new seconds to object
            deviceCollection[key].timeON = deviceCollection[key].timeON + (currentTime - beforeTime);
          }
        });

      }, 1000);
    });
  });
}

module.exports = usageCalculation;
