const fs = require('fs');
const path = require('path');
const parse = require('csv-parse');
const webPush = require('web-push');
require('dotenv').config();

const Subscription = require('../models/subscription');
//const dataPoint = require('../models/dataPoint');
const tileStatus = require('./tile-status');

// dataPoint.find((err, dataPoints) => {
//   console.log(dataPoints);
// });

let payload;

// Send notification
function sendNotification(subscription, payload) {
  // Set notification settings in promise
  webPush.sendNotification({
    endpoint: subscription.endpoint,
    keys: {
      p256dh: subscription.p256dh,
      auth: subscription.auth
    }
  }, payload).then(() => {
    console.log('Push Application Server - Notification sent to ' + subscription.endpoint);
  }).catch((err) => {
    // Remove from subscription list in DB when there is a error
    Subscription.findOneAndRemove({endpoint: subscription.endpoint}, function (err, docs) {});
    console.log('ERROR in sending Notification, endpoint removed ' + subscription.endpoint);
    console.log(err);
  });
}
// // Get all subscriptions and push message
// Subscription.find((err, subscriptions) => {
//   // Message payload (now static but needs to be dynamic)
//   const payload = 'Nog een test 3';
//   // Loop trough all the subscriptions
//   for (let i = 0; i < subscriptions.length; i++) {
//     sendNotification(subscriptions[i], payload);
//   }
// });

function gasBagHigh(output, i) {
  if (tileStatus(output[i]).gasbagStatus === 0) {
    // Get all subscriptions and push message
    Subscription.find((err, subscriptions) => {
      // Message payload (now static but needs to be dynamic)
      payload = 'De gaszak word te hoog!';
      // Loop trough all the subscriptions
      for (let i = 0; i < subscriptions.length; i++) {
        sendNotification(subscriptions[i], payload);
      }
    });
  }
}


fs.readFile('./data/sample-data.csv', (err, data) => {
  if (err) {
    throw err;
  }
  parse(data, {columns: ['Date', 'Time', 'PT100_real_1', 'PT100_real_2', 'Bag_Height', 'ph_value', 'input_value', 'heater_status']}, (error, output) => {
    if (error) {
      throw error;
    }

    let i = 1;
    const sendItemsCount = 30;

    setInterval(() => {
      if (!output[i + sendItemsCount]) {
        i = 1;
      }

      const dataCollection = [];

      for (let x = 1; x <= sendItemsCount; x++) {
        dataCollection.push(output[x + i]);
      }

      i += 30;

      console.log(tileStatus(output[i]));
      gasBagHigh(output, i);

      // io.sockets.emit('dataPoint', dataCollection, tileStatus(output[i]));
    }, 3000);
  });
});

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
      console.log('added');
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
      console.log('removed');
      // Remove device from DB based in endpoint when find it will removed
      Subscription.findOneAndRemove({endpoint: endpoint}, function (err, docs) {});
    }
    res.type('js').send('{"success":true}');
  });
}
// source: https://serviceworke.rs/push-subscription-management.html

// Export module
module.exports = serviceWorker;
