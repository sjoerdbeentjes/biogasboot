const webPush = require('web-push');
require('dotenv').config();

const Subscription = require('../models/subscription');

function serviceWorker(app) {

// Setting the Google Cloud Messaging API Key.
  if (!process.env.GCM_API_KEY) {
    console.error('If you want Chrome to work, you need to set the ' +
    'GCM_API_KEY environment variable to your GCM API key.');
  } else {
    webPush.setGCMAPIKey(process.env.GCM_API_KEY);
  }

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
  // Get all subscriptions and push message
  Subscription.find((err, subscriptions) => {
    // Message payload (now static but needs to be dynamic)
    const payload = 'Nog een test 3';
    // Loop trough all the subscriptions
    for (let i = 0; i < subscriptions.length; i++) {
      sendNotification(subscriptions[i], payload);
    }
  });

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
      // Remove device from DB based in endpoint
      Subscription.findOneAndRemove({endpoint: endpoint}, function (err, docs) {});
    }
    res.type('js').send('{"success":true}');
  });
}
// source: https://serviceworke.rs/push-subscription-management.html

// Export module
module.exports = serviceWorker;
