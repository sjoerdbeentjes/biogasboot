const moment = require('moment');

const StatusPoint = require('../models/statusPoint');



const usageCalculation = {
  init(req, res, range) {
    StatusPoint.find((err, statuspoints) => {
      if(range) {
        return usageCalculation.getByrange(statuspoints, range, req, res);
      } else {
        return usageCalculation.getAll(statuspoints, req, res);
      }
    });
  },
  // Get all the seconds
  getAll(output, req, res) {
    // Clean object for calculation
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
    let i;
    for (i = 1; i < output.length; i++) {
      // Unix time in seconds
      let currentTime = moment(output[i].Date).valueOf() / 1000;
      let beforeTime = moment(output[i - 1].Date).valueOf() / 1000;
      // Adds seconds to
      Object.keys(output[i].toObject()).forEach(function (key) {
        let valNumberBefore = Number(output[i - 1][key]);
        if (valNumberBefore === 1) {
          // Added new seconds to object
          deviceCollection[key].timeON = deviceCollection[key].timeON + (currentTime - beforeTime);
          // kWh = time in seconds / 3600 (is hours) * watts / 1000
          deviceCollection[key].kWh = ((deviceCollection[key].timeON / 3600) * deviceCollection[key].watts / 1000).toFixed(5);
        }

      });
    }
    // Returns when data is calculated
    if (i === output.length) {
      res.send(deviceCollection);
    }
  },
  // Get by range of 1 month
  getByrange(output, range, req, res) {
    // Clean object for calculation
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
    let i;
    range = Number(range);
    const inputRange = 1;
    const months = moment.duration(inputRange, 'months').valueOf() / 1000;
    const startCount = range;
    const endCount = startCount + months;
    for (i = 1; i < output.length; i++) {
      // Unix time in seconds
      let currentTime = moment(output[i].Date).valueOf() / 1000;
      let beforeTime = moment(output[i - 1].Date).valueOf() / 1000;
      if (currentTime >= startCount && currentTime <= endCount) {
        // Adds seconds to
        Object.keys(output[i].toObject()).forEach(function (key) {
          let valNumberBefore = Number(output[i - 1][key]);
          if (valNumberBefore === 1) {
            // Added new seconds to object
            deviceCollection[key].timeON = deviceCollection[key].timeON + (currentTime - beforeTime);
            // kWh = time in seconds / 3600 (is hours) * watts / 1000
            deviceCollection[key].kWh = ((deviceCollection[key].timeON / 3600) * deviceCollection[key].watts / 1000).toFixed(5);
          }

        });
      }
    }
    // Returns when data is calculated
    if (i === output.length) {
      res.send(deviceCollection)
    }
  }
}

module.exports = usageCalculation;
