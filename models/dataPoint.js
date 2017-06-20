const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;

const DataPointSchema = mongoose.Schema({
  Date: {
    type: Date
  },
  Temp_PT100_1: {
    type: Number
  },
  Temp_PT100_2: {
    type: Number
  },
  pH_Value: {
    type: Number
  },
  Bag_Height: {
    type: Number
  }
});

const DataPoint = module.exports = mongoose.model('DataPoint', DataPointSchema);
