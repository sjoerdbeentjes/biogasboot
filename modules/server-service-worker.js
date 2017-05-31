const webPush = require('web-push');
require('dotenv').config();

function serviceWorker(app) {
// Global array collecting all active endpoints. In real world
// application one would use a database here.
  const subscriptions = [];

// How often (in seconds) should the server send a notification to the
// user.
  const pushInterval = 10;

// Setting the Google Cloud Messaging API Key.
  if (!process.env.GCM_API_KEY) {
    console.error('If you want Chrome to work, you need to set the ' +
    'GCM_API_KEY environment variable to your GCM API key.');
  } else {
    webPush.setGCMAPIKey(process.env.GCM_API_KEY);
  }

// Send notification to the push service. Remove the endpoint from the
// `subscriptions` array if the  push service responds with an error.
// Subscription has been cancelled or expired.
  function sendNotification(endpoint) {
    webPush.sendNotification({
      endpoint
    }).then(() => {
      console.log('Push Application Server - Notification sent to ' + endpoint);
    }).catch(() => {
      console.log('ERROR in sending Notification, endpoint removed ' + endpoint);
      subscriptions.splice(subscriptions.indexOf(endpoint), 1);
    });
  }

// In real world application is sent only if an event occured.
// To simulate it, server is sending a notification every `pushInterval` seconds
// to each registered endpoint.
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
// source: https://serviceworke.rs/push-rich.html

// Export module
module.exports = serviceWorker;
