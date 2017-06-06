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
    type: String
  },
  PT100_real_1: {
    type: String
  },
  PT100_real_2: {
    type: String
  },
  Gaszak_hoogte_hu: {
    type: String
  }
});

const DataPoint = module.exports = mongoose.model('DataPoint', DataPointSchema);
