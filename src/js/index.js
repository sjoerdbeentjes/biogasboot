// if ('serviceWorker' in navigator) {
//   let endpoint;
//
//   // Register a Service Worker.
//   navigator.serviceWorker.register('service-worker.js')
//     .then(registration => {
//       // Use the PushManager to get the user's subscription to the push service.
//       return registration.pushManager.getSubscription()
//         .then(subscription => {
//           // If a subscription was found, return it.
//           if (subscription) {
//             return subscription;
//           }
//
//           // Otherwise, subscribe the user (userVisibleOnly allows to specify that we don't plan to
//           // send notifications that don't have a visible effect for the user).
//           return registration.pushManager.subscribe({userVisibleOnly: true});
//         });
//     }).then(subscription => {
//       endpoint = subscription.endpoint;
//     // Send the subscription details to the server using the Fetch API.
//       fetch('./register', {
//         method: 'post',
//         headers: {
//           'Content-type': 'application/json'
//         },
//         body: JSON.stringify({
//           endpoint: subscription.endpoint
//         })
//       });
//     });
//   // source: https://serviceworke.rs/push-rich.html
// }

require('./modules/real-time-graph');
require('./modules/history-graph');
require('./modules/customer-dashboard');

// Tiles update
require('./modules/real-time-tiles');

// Include serviceworker
require('./serviceworker-index.js');
