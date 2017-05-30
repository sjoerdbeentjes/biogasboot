// Register event listener for the 'push' event.
self.addEventListener('push', function(event) {
  // Keep the service worker alive until the notification is created.
  event.waitUntil(
    // Show a notification with title 'ServiceWorker Cookbook' and body 'Alea iacta est'.
    // Set other parameters such as the notification language, a vibration pattern associated
    // to the notification, an image to show near the body.
    // There are many other possible options, for an exhaustive list see the specs:
    //   https://notifications.spec.whatwg.org/
    self.registration.showNotification('Biogasboot update', {
      lang: 'nl',
      title: 'Biogasboot',
      body: 'Biogasboot notificatie body tekst',
      icon: '/images/icons/favicon-96x96.png',
      badge: '/images/icons/favicon-96x96.png',
      vibrate: [500, 100, 500],
    })
  );
});
// source: https://serviceworke.rs/push-rich.html
