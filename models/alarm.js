const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;

const AlarmSchema = mongoose.Schema({
  Date: {
    type: Date
  },
  Event: {
    type: String
  },
  Group: {
    type: String
  },
  AlarmName: {
    type: String
  }
});

const DataPoint = module.exports = mongoose.model('Alarm', AlarmSchema);
