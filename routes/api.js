const fs = require('fs');
const parse = require('csv-parse');
const express = require('express');
const moment = require('moment');
const DataPoint = require('../models/dataPoint');
const StatusPoint = require('../models/statusPoint');
const router = express.Router();
const usageCalculation = require('../modules/usage-calculation');

function setData(req, res) {
  fs.readFile('./data/sample-data.csv', (err, data) => {
    if (err) {
      throw err;
    }
    parse(data, {
      columns: ['Date', 'Time', 'PT100_real_1', 'PT100_real_2', 'Gaszak_hoogte_hu']
    }, (error, output) => {
      if (error) {
        throw error;
      }
      output.forEach(item => {
        const dataPoint = new DataPoint(item);
        dataPoint.save(err => {
          if (err) {
            throw err;
          }
        });
      });
      res.send(output);
    });
  });
}

router.get('/range', (req, res, next) => {
  if (req.param('api_key') && req.param('api_key') == process.env.API_KEY) {
    const startDate = moment(Number(req.param('dateStart') * 1000));
    const endDate = moment(Number(req.param('dateEnd') * 1000));
    DataPoint.find({
      Date: {
        $gte: startDate.toDate(),
        $lt: endDate.toDate()
      }
    }).exec((err, data) => {
      res.send(data);
    });
  } else {
    res.send('No valid API key');
  }
});

router.get('/range/average', (req, res, next) => {
  if (req.param('api_key') && req.param('api_key') == process.env.API_KEY) {
    const startDate = moment(Number(req.param('dateStart') * 1000));
    const endDate = moment(Number(req.param('dateEnd') * 1000));
    DataPoint.aggregate([{
      $match: {
          Date: {
            $gte: startDate.toDate(),
            $lt: endDate.toDate()
          }
        }
    },
    {
      $group: {
          _id: null,
          Temp_PT100_1: {
            $avg: '$Temp_PT100_1'
          },
          Temp_PT100_2: {
            $avg: '$Temp_PT100_2'
          },
          pH_Value: {
            $avg: '$pH_Value'
          },
          Bag_Height: {
            $avg: '$Bag_Height'
          },
          count: {
            $sum: 1
          }
        }
    }
    ], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  } else {
    res.send('No valid API key');
  }
});


//http://localhost:3000/api/range/monthperday?dateStart=1470002400&dateEnd=1472680800&api_key=CMD17
router.get('/range/monthperday/', (req, res, next) => {
  if (req.param('api_key') && req.param('api_key') == process.env.API_KEY) {
    const startDate = moment(Number(req.param('dateStart') * 1000));
    const endDate = moment(Number(req.param('dateEnd') * 1000));
    DataPoint.aggregate([{
      $match: {
          Date: {
            $gte: startDate.toDate(),
            $lt: endDate.toDate()
          }
        }
    }, {$group: {_id: {
        year: {$year: '$Date'},
        month: {$month: '$Date'},
        day: {$dayOfMonth: '$Date'}
       }, Temp_PT100_1: {
            $avg: '$Temp_PT100_1'
          },
          Temp_PT100_2: {
            $avg: '$Temp_PT100_2'
          },
          pH_Value: {
            $avg: '$pH_Value'
          },
          Bag_Height: {
            $avg: '$Bag_Height'
          },
          count: {
            $sum: 1
          },}
      }
    ], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  } else {
    res.send('No valid API key');
  }
});

/* GET home page. */
router.get('/latest', (req, res, next) => {
  if (req.param('api_key') && req.param('api_key') == process.env.API_KEY) {
    DataPoint.findOne({}, {}, {
      sort: {
        Date: -1
      }
    }, (err, point) => {
      res.send(point);
    });
  } else {
    res.send('No valid API key');
  }
});

/* GET home page. */
router.get('/status', (req, res, next) => {
  if (req.param('api_key') && req.param('api_key') == process.env.API_KEY) {
    DataPoint.findOne({}, {}, {
      sort: {
        Date: -1
      }
    }, (err, point) => {
      res.send(tileSatus(point));
    });
  } else {
    res.send('No valid API key');
  }
});

router.get('/status/range/:range', (req, res, next) => {
  if (req.param('api_key') && req.param('api_key') == process.env.API_KEY) {
    const range = req.params.range;
    usageCalculation.init(req, res, range);
  } else {
    res.send('No valid API key');
  }
});

router.get('/status/test', (req, res, next) => {
  if (req.param('api_key') && req.param('api_key') == process.env.API_KEY) {
    console.log(StatusPoint);
  } else {
    res.send('No valid API key');
  }
});

router.get('/status/all', (req, res, next) => {
  if (req.param('api_key') && req.param('api_key') == process.env.API_KEY) {
    usageCalculation.init(req, res);
  } else {
    res.send('No valid API key');
  }
});

function tileSatus(data) {
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
      high: 160,
      min: 10,
      max: 200
    }
  };
  // Explain number meanings
  // 0 = Good
  // 1 = Error
  // Gasbag indicator
  switch (true) {
    case data.Gaszak_hoogte_hu >= types.gasbag.low && data.Gaszak_hoogte_hu <= types.gasbag.high:
      // Good
      statusData.gasbagStatus = 0;
      break;
    case data.Gaszak_hoogte_hu > types.gasbag.high:
      // ADD NOTIFICATION FUNCTION HERE
      // Error + bag is almost full
      statusData.gasbagStatus = 1;
      break;
    case data.Gaszak_hoogte_hu < types.gasbag.low:
      // ADD NOTIFICATION FUNCTION HERE
      // Error + bag is almost empty
      statusData.gasbagStatus = 1;
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

const checkForKey = (req, res) => {
  console.log('hola');
};

module.exports = router;
