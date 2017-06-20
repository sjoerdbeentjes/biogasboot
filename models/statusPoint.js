const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
//     fileColumns: ['Date', 'Time', 'Storagetank_Mixe', 'Storagetank_Feed', 'Digester_Mixer', 'Digester_Heater_1', 'Digester_Heater_2', 'Gaspump', 'Mode_Stop', 'Mode_Manual', 'Mode_Auto', 'System_Started', 'Additive_Pump']

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;

const StatusPointSchema = mongoose.Schema({
  Date: {
    type: Date
  },
  Storagetank_Mixe: {
    type: Number
  },
  Storagetank_Feed: {
    type: Number
  },
  Digester_Mixer: {
    type: Number
  },
  Digester_Heater_1: {
    type: Number
  },
  Digester_Heater_2: {
    type: Number
  },
  Gaspump: {
    type: Number
  },
  Mode_Stop: {
    type: Number
  },
  Mode_Manual: {
    type: Number
  },
  Mode_Auto: {
    type: Number
  },
  System_Started: {
    type: Number
  },
  Additive_Pump: {
    type: Number
  }
});

const StatusPoint = module.exports = mongoose.model('statuspoint', StatusPointSchema);
