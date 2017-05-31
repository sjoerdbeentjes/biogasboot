const webPush = require('web-push');
require('dotenv').config();

function serviceWorker(app) {

// Store subscriptions
  const subscriptions = [];

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
  function sendNotification(endpoint) {
    webPush.sendNotification({
      endpoint
    }).then(() => {
      console.log('Push Application Server - Notification sent to ' + endpoint);
    }).catch((err) => {
      console.log('ERROR in sending Notification, endpoint removed ' + endpoint);
      subscriptions.splice(subscriptions.indexOf(endpoint), 1);
      console.log(err);
    });
  }

// Simulate send notifications needs to be disabled
  setInterval(() => {
    subscriptions.forEach(sendNotification);
  }, pushInterval * 1000);

  function isSubscribed(endpoint) {
    return (subscriptions.indexOf(endpoint) >= 0);
  }

// Register a subscription by adding an endpoint to the `subscriptions`
  app.post('/register-serviceworker', (req, res) => {
    const endpoint = req.body.endpoint;
    if (!isSubscribed(endpoint)) {
      console.log('Subscription registered ' + endpoint);
      subscriptions.push(endpoint);
    }
    res.type('js').send('{"success":true}');
  });

  // Unregister a subscription by removing it from the `subscriptions` array
  app.post('/unregister-serviceworker', (req, res) => {
    const endpoint = req.body.endpoint;
    if (isSubscribed(endpoint)) {
      console.log('Subscription unregistered ' + endpoint);
      subscriptions.splice(subscriptions.indexOf(endpoint), 1);
    }
    res.type('js').send('{"success":true}');
  });
}
// source: https://serviceworke.rs/push-subscription-management.html

// Export module
module.exports = serviceWorker;
