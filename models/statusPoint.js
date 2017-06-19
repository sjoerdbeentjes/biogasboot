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
    type: String
  },
  Storagetank_Feed: {
    type: String
  },
  Digester_Mixer: {
    type: String
  },
  Digester_Heater_1: {
    type: String
  },
  Digester_Heater_2: {
    type: String
  },
  Mode_Stop: {
    type: String
  },
  Mode_Manual: {
    type: String
  },
  Mode_Auto: {
    type: String
  },
  System_Started: {
    type: String
  },
  Additive_Pump: {
    type: String
  }
});

const StatusPoint = module.exports = mongoose.model('statuspoint', StatusPointSchema);
