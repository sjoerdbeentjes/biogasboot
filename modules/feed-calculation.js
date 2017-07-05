const config = require('./config');
const StatusPoint = require('../models/statusPoint');

const feedCalculation = {
  init(req, res) {
    // Calculate the from date and the actual date
    StatusPoint.find({ }, (err, statuspoints) => {
        return feedCalculation.handleResult(statuspoints, req, res);
    });
  },
  handleResult(output, req, res) {
    let feedOn = false;
    let latestDate = false;
    let secondsOn = 0;
    output.forEach(function(data) {
      if(data['Storagetank_Feed'] == 1 && feedOn === false) {
        latestDate = new Date(data['Date']);
        feedOn = true;
      } else if(feedOn === true && data['Storagetank_Feed'] == 0) {
        let actualDate = new Date(data['Date']);
        let difference = (actualDate - latestDate) / 1000;
        /* Hack to solve the problem with false data, this if statement
           can be deleted as soon as the real data is pushed to the server */
        if(difference > 100) {
          difference = 0;
        }
        secondsOn += difference;
        feedOn = false;
      }
    });
    this.calculateAmount(secondsOn, req, res)
  },
  calculateAmount(seconds, req, res) {
    let data = {
      hours: hours = (seconds / 60) / 60,
      kilograms: hours * 256
    };
    res.send(data);
  }
}

module.exports = feedCalculation;
