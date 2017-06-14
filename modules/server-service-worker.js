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
    // let i;
    // for( i = subscriptions.length; i >= 0; i++) {
    //   if( subscriptions[i].endpoint === endpoint){
    //     return console.log(subscriptions[i]);
    //     //return subscriptions[i].endpoint;
    //   }
    // }
    // return (Object.keys(subscriptions).indexOf(endpoint) >= 0);
    //return (subscriptions.indexOf(endpoint) >= 0);
    // for (let key in subscriptions) {
    //   let value = subscriptions[key].endpoint;
    //   return (value.indexOf(endpoint) >= 0);
    // }
    // const result = subscriptions.filter(function( obj ) {
    //   return obj.endpoint === endpoint;
    // });
    // return result;
    // const indexes = subscriptions.map(function(obj, index) {
    //   if(obj.endpoint === endpoint) {
    //     return index;
    //   }
    // }).filter(isFinite);
    // return (indexes >= 0);
    // const index = subscriptions.findIndex(endpoint);
    // return index;
    // let check = subscriptions.filter(function( obj, idx ) {
    //   if( obj.endpoint === endpoint ) {
    //     const index = idx;
    //     return true;
    //   } else {
    //     return false
    //   }
    // });
    // return check;
    // for (var i = 0; i < subscriptions.length - 1; i++) {
    //
    //     if (subscriptions[i].endpoint === endpoint) {
    //       return true;
    //     }
    // }
    //   return false
    const index = subscriptions.findIndex(x => x.endpoint==endpoint);
    return index;

    }

    //return (subscriptions.indexOf(endpoint) >= 0);

// Register a subscription by adding an endpoint to the `subscriptions`
  app.post('/operator/register-serviceworker', (req, res) => {
    const endpoint = req.body.endpoint;
    const p256dh = req.body.key;
    const auth = req.body.authSecret;
    console.log('r: ' + isSubscribed(endpoint));
    if (!isSubscribed(endpoint)) {
      subscriptions.push( [{endpoint: endpoint, p256dh:p256dh, auth:auth}]);
    }
    res.type('js').send('{"success":true}');
  });

  // Unregister a subscription by removing it from the `subscriptions` array
  app.post('/operator/unregister-serviceworker', (req, res) => {
    const endpoint = req.body.endpoint;
    //console.log(subscriptions);
    console.log('u: ' + isSubscribed(endpoint));
    if (isSubscribed(endpoint)) {
      //console.log(endpoint);
      console.log('Subscription unregistered ' + endpoint);
      //subscriptions.splice(subscriptions.findIndex(x => x.endpoint === endpoint), 1);
      // let i;
      // for( i = subscriptions.length; i>=0; i--) {
      //   if( subscriptions[i].endpoint === endpoint){
      //     subscriptions.splice(i,1);
      //     console.log('test: ' + subscriptions);
      //   }
      // }
      // console.log(subscriptions);
    }
    res.type('js').send('{"success":true}');
  });
}
// source: https://serviceworke.rs/push-subscription-management.html

// Export module
module.exports = serviceWorker;
