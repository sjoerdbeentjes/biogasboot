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
      watts: 180,
      kWh: 0
    },
    Storagetank_Feed: {
      timeON: 0,
      watts: 210,
      kWh: 0
    },
    Digester_Mixer: {
      timeON: 0,
      watts: 0,
      kWh: 0
    },
    Digester_Heater_1: {
      timeON: 0,
      watts: 2000,
      kWh: 0
    },
    Digester_Heater_2: {
      timeON: 0,
      watts: 2000,
      kWh: 0
    },
    Gaspump: {
      timeON: 0,
      watts: 550,
      kWh: 0
    },
    Mode_Stop: {
      timeON: 0,
      watts: 0,
      kWh: 0
    },
    Mode_Manual: {
      timeON: 0,
      watts: 0,
      kWh: 0
    },
    Mode_Auto: {
      timeON: 0,
      watts: 0,
      kWh: 0
    },
    System_Started: {
      timeON: 0,
      watts: 0,
      kWh: 0
    },
    Additive_Pump: {
      timeON: 0,
      watts: 0,
      kWh: 0
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
      // Get all the seconds
      function getAll() {
        let i;
        for (i = 1; i < output.length; i++) {
          // Unix time in seconds
          let currentTime = moment(output[i].Date + ' ' + output[i].Time, 'DD-MM-YYYY HH:mm:ss').valueOf() / 1000;
          let beforeTime = moment(output[i - 1].Date + ' ' + output[i - 1].Time, 'DD-MM-YYYY HH:mm:ss').valueOf() / 1000;
          // Adds seconds to
          Object.keys(output[i]).forEach(function (key) {
            let valNumberBefore = Number(output[i - 1][key]);
            if (valNumberBefore === 1) {
              // Added new seconds to object
              deviceCollection[key].timeON = deviceCollection[key].timeON + (currentTime - beforeTime);
              // kWh = time in seconds / 3600 (is hours) * watts / 1000
              deviceCollection[key].kWh = ((deviceCollection[key].timeON / 3600) * deviceCollection[key].watts / 1000).toFixed(5);
              console.log(deviceCollection);

            }
          });
        }
      }
      //getAll();

      // Get by range
      function getByrange() {
        let i;
        const inputStart = '';
        const inputRange = 24;
        const hours = moment.duration(inputRange, 'hours').valueOf() / 1000;
        const startCount = moment('07-06-2017 10:00:00', 'DD-MM-YYYY HH:mm:ss').valueOf() / 1000;
        const endCount = startCount + hours;

        for (i = 1; i < output.length; i++) {
          // Unix time in seconds
          let currentTime = moment(output[i].Date + ' ' + output[i].Time, 'DD-MM-YYYY HH:mm:ss').valueOf() / 1000;
          let beforeTime = moment(output[i - 1].Date + ' ' + output[i - 1].Time, 'DD-MM-YYYY HH:mm:ss').valueOf() / 1000;
          if (currentTime >= startCount && currentTime <= endCount) {
            // Adds seconds to
            Object.keys(output[i]).forEach(function (key) {
              let valNumberBefore = Number(output[i - 1][key]);
              if (valNumberBefore === 1) {
                // Added new seconds to object
                deviceCollection[key].timeON = deviceCollection[key].timeON + (currentTime - beforeTime);
                // kWh = time in seconds / 3600 (is hours) * watts / 1000
                deviceCollection[key].kWh = ((deviceCollection[key].timeON / 3600) * deviceCollection[key].watts / 1000 * 30).toFixed(5);
                console.log(deviceCollection);
              }
            });
          }
        }
      }
      getByrange();

    });
  });
}

module.exports = usageCalculation;
