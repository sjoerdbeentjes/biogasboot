const webPush = require('web-push');
require('dotenv').config();

function serviceWorker(app) {

// Store subscriptions
  const subscriptions = [];
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
    console.log(data[0]);
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
  setInterval(() => {
    subscriptions.forEach(sendNotification);
  }, pushInterval * 1000);

  function isSubscribed(endpoint) {
    return (Object.keys(subscriptions).indexOf(endpoint) >= 0);
  }

// Register a subscription by adding an endpoint to the `subscriptions`
  app.post('/operator/register-serviceworker', (req, res) => {
    //console.log(req.body);
    const endpoint = req.body.endpoint;
    const p256dh = req.body.key;
    const auth = req.body.authSecret;
    if (!isSubscribed(endpoint)) {
      //console.log('Subscription registered ' + endpoint);
      subscriptions.push( [{endpoint: endpoint, p256dh:p256dh, auth:auth}]);
      console.log(Object.keys(subscriptions));
    }
    res.type('js').send('{"success":true}');
  });

  // Unregister a subscription by removing it from the `subscriptions` array
  app.post('/operator/unregister-serviceworker', (req, res) => {
    const endpoint = req.body.endpoint;

    if (isSubscribed(endpoint)) {
      console.log('Subscription unregistered ' + endpoint);
      subscriptions.splice(Object.keys(subscriptions).indexOf(endpoint), 1);
      //console.log(subscriptions);
    }
    res.type('js').send('{"success":true}');
  });
}
// source: https://serviceworke.rs/push-subscription-management.html

// Export module
module.exports = serviceWorker;
