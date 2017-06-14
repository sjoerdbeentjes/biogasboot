const webPush = require('web-push');
require('dotenv').config();

const Subscription = require('../models/subscription');

function serviceWorker(app) {

// Store subscriptions
  //const subscriptions = [];
  const payload = 'TESTEN';

// Push interval (10 seconds)
  const pushInterval = 10;

// Setting the Google Cloud Messaging API Key.
  if (!process.env.GCM_API_KEY) {
    console.error('If you want Chrome to work, you need to set the ' +
    'GCM_API_KEY environment variable to your GCM API key.');
  } else {
    webPush.setGCMAPIKey(process.env.GCM_API_KEY);
  }

// Send notification
  function sendNotification(data) {
    webPush.sendNotification({
      endpoint: data[0].endpoint,
      keys: {
        p256dh: data[0].p256dh,
        auth: data[0].auth
      }
    }, payload).then(() => {
      console.log('Push Application Server - Notification sent to ' + data[0]);
    }).catch((err) => {
      console.log('ERROR in sending Notification, endpoint removed ' + data[0]);
      subscriptions.splice(subscriptions.indexOf(data[0]), 1);
      console.log(err);
    });
  }

//Simulate send notifications needs to be disabled
//   setInterval(() => {
//     subscriptions.forEach(sendNotification);
//   }, pushInterval * 1000);

  // Check if device is already subscribed
  function checkSubscription(endpoint) {
    return Subscription.find({endpoint: endpoint}, function (err, docs) {
      return docs;
    });
  }

// Register a subscription by adding an endpoint to the `subscriptions`
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

  // Unregister a subscription by removing it from the `subscriptions` array
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
