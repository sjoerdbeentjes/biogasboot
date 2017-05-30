const webPush = require('web-push');
require('dotenv').config();

function serviceWorker (app){
// Use the web-push library to hide the implementation details of the communication
// between the application server and the push service.
// For details, see https://tools.ietf.org/html/draft-ietf-webpush-protocol and
// https://tools.ietf.org/html/draft-ietf-webpush-encryption.

  webPush.setGCMAPIKey(process.env.GCM_API_KEY);

  app.post('/register', function(req, res) {
    // A real world application would store the subscription info.
    res.sendStatus(201);
  });

  app.post('/sendNotification', function(req, res) {
    setTimeout(function() {
      webPush.sendNotification({
        endpoint: req.query.endpoint,
        TTL: req.query.ttl,
      })
        .then(function() {
          res.sendStatus(201);
        })
        .catch(function(error) {
          res.sendStatus(500);
          console.log(error);
        })
    }, req.query.delay * 1000);
  });
}
// source: https://serviceworke.rs/push-rich.html

// Export module
module.exports = serviceWorker;