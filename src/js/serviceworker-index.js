// subscription button for notifications
const subscriptionButton = document.getElementById('subscriptionButton');
let key;
let authSecret;

if (subscriptionButton) {
  // Get the subscription
  function getSubscription() {
    return navigator.serviceWorker.ready
      .then(registration => {
        return registration.pushManager.getSubscription();
      });
  }

  // Register serviceWorker and check if is available
  if ('serviceWorker' in navigator) {

    navigator.serviceWorker.register('/service-worker.js')
      .then(() => {
        // Console shows if registered
        console.log('service worker registered');
        // Remove disabled when their is a serviceWorker
        subscriptionButton.removeAttribute('disabled');
      });
    getSubscription()
      .then(subscription => {
        if (subscription) {
          console.log('Already subscribed', subscription.endpoint);
          // Button state
          setUnsubscribeButton();
        } else {
          // Button state
          setSubscribeButton();
        }
      });
  }

  // Post to /register-serviceworker to add to subscription list and change button state
  function subscribe() {
    navigator.serviceWorker.ready.then(registration => {
      return registration.pushManager.subscribe({
        userVisibleOnly: true
      });
    }).then(subscription => {
      console.log('Subscribed', subscription.endpoint);
      // Generate keys
      // Source: https://serviceworke.rs/push-payload_index_doc.html
      let rawKey = subscription.getKey ? subscription.getKey('p256dh') : '';
      key = rawKey ?
        btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))) :
        '';
      let rawAuthSecret = subscription.getKey ? subscription.getKey('auth') : '';
      authSecret = rawAuthSecret ?
        btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret))) :
        '';
      return fetch('/operator/register-serviceworker', {
        method: 'post',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
          key: key,
          authSecret: authSecret,
        })
      });
    }).then(setUnsubscribeButton);
  }

  // Post to /unregister-serviceworker to remove from subscription list and change button state
  function unsubscribe() {
    getSubscription().then(subscription => {
      return subscription.unsubscribe()
        .then(() => {
          // Post to /unregister-serviceworker to remove from subscription list
          console.log('Unsubscribed', subscription.endpoint);
          return fetch('/operator/unregister-serviceworker', {
            method: 'post',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify({
              endpoint: subscription.endpoint
            })
          });
        });
    }).then(setSubscribeButton);
  }

  // Change button text to Subscribe
  function setSubscribeButton() {
    subscriptionButton.onclick = subscribe;
    subscriptionButton.textContent = 'Subscribe!';
  }

  // Change button text to Unsubscribe
  function setUnsubscribeButton() {
    subscriptionButton.onclick = unsubscribe;
    subscriptionButton.textContent = 'Unsubscribe!';
  }

  // source: https://serviceworke.rs/push-subscription-management.html
}