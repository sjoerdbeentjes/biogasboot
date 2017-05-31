// Listen to `push` notification event. Define the text to be displayed
// and show the notification.
self.addEventListener('push', event => {
  event.waitUntil(
    self.registration.showNotification('Biogasboot update', {
      lang: 'nl',
      title: 'Biogasboot',
      body: 'Biogasboot notificatie body tekst',
      icon: '/images/icons/favicon-96x96.png',
      badge: '/images/icons/favicon-96x96.png',
      vibrate: [500, 100, 500]
    })
  );
});

// Listen to  `pushsubscriptionchange` event which is fired when
// subscription expires. Subscribe again and register the new subscription
// in the server by sending a POST request with endpoint. Real world
// application would probably use also user identification.
self.addEventListener('pushsubscriptionchange', event => {
  console.log('Subscription expired');
  event.waitUntil(
    self.registration.pushManager.subscribe({userVisibleOnly: true})
      .then(subscription => {
        console.log('Subscribed after expiration', subscription.endpoint);
        return fetch('/register-serviceworker', {
          method: 'post',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            endpoint: subscription.endpoint
          })
        });
      })
  );
});
