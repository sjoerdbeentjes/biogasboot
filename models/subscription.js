const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;

const SubscriptionSchema = mongoose.Schema({
  endpoint: {
    type: String,
    index: true
  },
  p256dh: {
    type: String
  },
  auth: {
    type: String
  }
});

const Subscription = module.exports = mongoose.model('Subscription', SubscriptionSchema);
