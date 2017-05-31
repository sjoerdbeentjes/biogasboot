// Push notification config
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

// Refresh subscription
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
// source: https://serviceworke.rs/push-subscription-management.html
