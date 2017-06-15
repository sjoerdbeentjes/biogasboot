function tileStatus(data) {
  // values when attention is required or not.
  const statusData = {
    phStatus: 0,
    tempStatus: 0,
    gasbagStatus: 0
  };
  // Define low and high values for indicator, optional: min and max
  const types = {
    ph: {
      low: 7,
      high: 7.5,
      min: 1,
      max: 14
    },
    temp: {
      low: 34.6,
      high: 38
    },
    gasbag: {
      low: 145,
      high: 155,
      min: 10,
      max: 200
    }
  };
  // Explain number meanings
  // 0 = Good
  // 1 = Error
  // Gasbag indicator
  switch (true) {
    case data.Bag_Height >= types.gasbag.low && data.Bag_Height <= types.gasbag.high:
      // Good
      statusData.gasbagStatus = 0;
      break;
    case data.Bag_Height > types.gasbag.high:
      // ADD NOTIFICATION FUNCTION HERE
      // Error + bag is almost full
      statusData.gasbagStatus = 1;
      break;
    case data.Bag_Height < types.gasbag.low:
      // ADD NOTIFICATION FUNCTION HERE
      // Error + bag is almost empty
      statusData.gasbagStatus = 2;
      break;
    default:
      statusData.gasbagStatus = 0;
      break;
  }
  // PH indicator
  switch (true) {
    case data.ph_value >= types.ph.low && data.ph_value <= types.ph.high:
      // Good
      statusData.phStatus = 0;
      break;
    case data.ph_value > types.ph.high:
      // Error + ph to high
      statusData.phStatus = 1;
      break;
    case data.ph_value < types.ph.low:
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
}

module.exports = tileStatus;
