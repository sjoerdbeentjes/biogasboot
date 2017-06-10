const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;

const DataPointSchema = mongoose.Schema({
  Date: {
    type: String
  },
  Time: {
    type: Date
  },
  Temp_PT100_1: {
    type: String
  },
  Temp_PT100_2: {
    type: String
  },
  pH_Value: {
    type: String
  },
  Bag_Height: {
    type: String
  }
});

module.exports.getAllUniqueDates = function (username, callback) {
  const query = {username};
  DataPointSchema.findOne(query, callback);
};

const DataPoint = module.exports = mongoose.model('DataPoint', DataPointSchema);
