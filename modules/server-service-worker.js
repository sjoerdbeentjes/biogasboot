const fs = require('fs');
const path = require('path');
const parse = require('csv-parse');
const webPush = require('web-push');
require('dotenv').config();
const config = require('./config');
const Subscription = require('../models/subscription');

function serviceWorker(app) {

// Setting the Google Cloud Messaging API Key.
  if (!process.env.GCM_API_KEY) {
    console.error('If you want Chrome to work, you need to set the ' +
    'GCM_API_KEY environment variable to your GCM API key.');
  } else {
    webPush.setGCMAPIKey(process.env.GCM_API_KEY);
  }

  // Check if device is already subscribed
  function checkSubscription(endpoint) {
    // Check if subscriptions already exist in DB
    return Subscription.find({endpoint: endpoint}, function (err, docs) {
      return docs;
    });
  }

// Register a subscription by adding it to the DB Scheme
  app.post('/operator/register-serviceworker', (req, res) => {
    // Get parameters to save device
    const endpoint = req.body.endpoint;
    const p256dh = req.body.key;
    const auth = req.body.authSecret;
    if (checkSubscription(endpoint)) {
      console.log('Subscription added');
      // Add subscription to DB
      const newSubscription = new Subscription({endpoint: endpoint, p256dh: p256dh, auth: auth});
      newSubscription.save(function (err) {
        if (err) return console.error(err);
      });
    }
    res.type('js').send('{"success":true}');
  });

  // Unregister a subscription by removing it from the DB Scheme
  app.post('/operator/unregister-serviceworker', (req, res) => {
    const endpoint = req.body.endpoint;
    if (checkSubscription(endpoint)) {
      console.log('Subscription removed');
      // Remove device from DB based in endpoint when find it will removed
      Subscription.findOneAndRemove({endpoint: endpoint}, function (err, docs) {});
    }
    res.type('js').send('{"success":true}');
  });
}
// source: https://serviceworke.rs/push-subscription-management.html

// Export module
module.exports = serviceWorker;
