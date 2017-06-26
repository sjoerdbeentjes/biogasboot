module.exports = {
  tileStatus: function(data) {
    // values when attention is required or not.
    const statusData = {
      // Set default status indicators
      phStatus: 0,
      tempStatus: 0,
      gasbagStatus: 0
    };
    // Define low and high values for indicator, optional: min and max
    const types = {
      // Settings of PH value
      // Low  = When PH is going to low
      // high = When PH is going to high
      // min  = The minimal value of PH
      // max  = The maximal value of PH
      ph: {
        low: 7,
        high: 7.5,
        min: 1,
        max: 14
      },
      // Settings of Temperature value
      // Low  = When Temperature is going to low
      // high = When Temperature is going to high
      temp: {
        low: 34.6,
        high: 38
      },
      // Settings of Gasbag height value
      // Low  = When Gasbag is going to low
      // high = When Gasbag is going to high
      // min  = The minimal value of Gasbag
      // max  = The maximal value of Gasbag
      gasbag: {
        low: 145,
        high: 155,
        min: 10,
        max: 200
      }
    };
    // Explain number meanings
    // Send status code
    // 0 = Good
    // 1 = Error
    // Gasbag indicator
    switch (true) {
      case data.Bag_Height >= types.gasbag.low && data.Bag_Height <= types.gasbag.high:
        // Good
        statusData.gasbagStatus = 0;
        break;
      case data.Bag_Height > types.gasbag.high:
        // Error + bag is almost full
        statusData.gasbagStatus = 1;
        break;
      case data.Bag_Height < types.gasbag.low:
        // Error + bag is almost empty
        statusData.gasbagStatus = 2;
        break;
      default:
        statusData.gasbagStatus = 0;
        break;
    }
    // PH indicator
    switch (true) {
      case (data.ph_value / 100) >= types.ph.low && (data.ph_value / 100) <= types.ph.high:
        // Good
        statusData.phStatus = 0;
        break;
      case (data.ph_value / 100) > types.ph.high:
        // Error + ph to high
        statusData.phStatus = 1;
        break;
      case (data.ph_value / 100) < types.ph.low:
        // Error + bag to low
        statusData.phStatus = 1;
        break;
      default:
        statusData.phStatus = 0;
        break;
    }
    // Temp indicator
    switch (true) {
      case data.PT100_real_1 >= types.temp.low && data.PT100_real_1 <= types.temp.high:
        // Good
        statusData.tempStatus = 0;
        break;
      case data.PT100_real_1 > types.temp.high:
        // Error + temp to high
        statusData.tempStatus = 1;
        break;
      case data.PT100_real_1 < types.temp.low:
        // Error + temp to low
        statusData.tempStatus = 1;
        break;
      default:
        statusData.tempStatus = 0;
        break;
    }

    return statusData;
  },
  deviceWatts: {
      // Watts per device, those are used in the calculations
      Storagetank_Mixe: {
        watts: 180,
      },
      Storagetank_Feed: {
        watts: 210,
      },
      Digester_Mixer: {
        watts: 0,
      },
      Digester_Heater_1: {
        watts: 2000,
      },
      Digester_Heater_2: {
        watts: 2000,
      },
      Gaspump: {
        watts: 550,
      },
      Mode_Stop: {
        watts: 0,
      },
      Mode_Manual: {
        watts: 0,
      },
      Mode_Auto: {
        watts: 0,
      },
      System_Started: {
        watts: 0,
      },
      Additive_Pump: {
        watts: 0,
      }
  },
  ftp: function() {
    const ftpSettings = {
      setup: {
        host: process.env.FTP_SERVER,
        port: 21,
        user: process.env.FTP_USER,
        pass: process.env.FTP_PASS
      },
      value: {
        directory: '/uploads/VALUE/VALUE/',
        downloadDir: '../data/ftp/VALUE/',
        schema: require('../models/dataPoint'),
        fileColumns: ['Date', 'Time', 'Temp_PT100_1', 'Temp_PT100_2', 'pH_Value', 'Bag_Height']
      },
      status: {
        directory: '/uploads/STATUS/STATUS/',
        downloadDir: '../data/ftp/STATUS/',
        schema: require('../models/statusPoint'),
        fileColumns: ['Date', 'Time', 'Storagetank_Mixe', 'Storagetank_Feed', 'Digester_Mixer', 'Digester_Heater_1', 'Digester_Heater_2', 'Gaspump', 'Mode_Stop', 'Mode_Manual', 'Mode_Auto', 'System_Started', 'Additive_Pump']
      }
    };
    return ftpSettings;
  }
};
