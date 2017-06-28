const DataPoint = require('../models/dataPoint');

const gasCalculations = {
  total(req, res) {
    DataPoint.aggregate([
      {
        $project: {
          Bag_Height: "$Bag_Height",
        }
      },
      {
        $match: {
          Bag_Height: {
            $lte: 240,
            $gte: 20
          }
        }
      }
    ], (err, results) => {
      totalData = {
        used: 0,
        generated: 0
      }
      let last = 0;
      results.forEach(function(result) {
        totalGas = 2.82 * 2.34 * (result.Bag_Height / 100);
        if(last === 0) {
          last = totalGas;
        } else if(totalGas > last) {
          totalData.generated += totalGas - last;
        } else if(totalGas < last) {
          console.log(last - totalGas)
          totalData.used += last - totalGas;
        }
        last = totalGas;
      })
      res.send(totalData)
    })

  }
}

module.exports = gasCalculations;
