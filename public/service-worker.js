// Push notification config
self.addEventListener('push', event => {
  const payload = event.data ? event.data.text() : 'no payload';
  event.waitUntil(
    self.registration.showNotification('Biogasboot update', {
      lang: 'nl',
      title: 'Biogasboot',
      body: payload,
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
    self.registration.pushManager.subscribe({
      userVisibleOnly: true
    })
      .then(subscription => {
        console.log('Subscribed after expiration', subscription.endpoint);
        return fetch('/register-serviceworker', {
          method: 'post',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            endpoint: subscription.endpoint,
          })
        });
      })
  );
});

self.addEventListener('notificationclick', function(event) {
  // change to live url!!!!!
  let url = 'http://localhost:3000/operator/dashboard';
  event.notification.close(); // Android needs explicit close.
  event.waitUntil(
    clients.matchAll({type: 'window'}).then( windowClients => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        let client = windowClients[i];
        // If so, just focus it.
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, then open the target URL in a new window/tab.
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
// source: https://serviceworke.rs/push-subscription-management.html
