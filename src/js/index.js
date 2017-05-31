 // subscription button for notifications
const subscriptionButton = document.getElementById('subscriptionButton');

// Get the subscription
function getSubscription() {
  return navigator.serviceWorker.ready
      .then(registration => {
        return registration.pushManager.getSubscription();
      });
}

// Register serviceWorker and check if is available
if ('serviceWorker' in navigator) {

  // function urlBase64ToUint8Array(base64String) {
  //   const padding = '='.repeat((4 - base64String.length % 4) % 4);
  //   const base64 = (base64String + padding)
  //     .replace(/\-/g, '+')
  //     .replace(/_/g, '/');
  //
  //   const rawData = window.atob(base64);
  //   const outputArray = new Uint8Array(rawData.length);
  //
  //   for (let i = 0; i < rawData.length; ++i) {
  //     outputArray[i] = rawData.charCodeAt(i);
  //   }
  //   return outputArray;
  // }
  //
  // const vapidPublicKey = 'BOemmPDlUwKlZI_3-Mt4kU6Ok8m82qyI0RyxLvC-Nn0GDvw7K7G2hjAGAW69ooRWg5hTW35KmCBnonyef-gSSpY';
  // const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
  // console.log(convertedVapidKey);

  navigator.serviceWorker.register('service-worker.js')
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

 // function urlBase64ToUint8Array(base64String) {
 //   const padding = '='.repeat((4 - base64String.length % 4) % 4);
 //   const base64 = (base64String + padding)
 //     .replace(/\-/g, '+')
 //     .replace(/_/g, '/');
 //
 //   const rawData = window.atob(base64);
 //   const outputArray = new Uint8Array(rawData.length);
 //
 //   for (let i = 0; i < rawData.length; ++i) {
 //     outputArray[i] = rawData.charCodeAt(i);
 //   }
 //   return outputArray;
 // }

// Post to /register-serviceworker to add to subscription list and change button state
function subscribe() {
  navigator.serviceWorker.ready.then(registration => {
    return registration.pushManager.subscribe({
      userVisibleOnly: true
      // applicationServerKey: urlBase64ToUint8Array(
      //   'BID8B7jUAer8nTn0JnnvfmeTyx7JmJL6KndLBVcwXE7Gk2nM4VZMRBOKW9LEiK2wSBjEkt9ybSlrbcx1CBij9pQ'
      // )
    });
  }).then(subscription => {
    console.log('Subscribed', subscription.endpoint);
    return fetch('register-serviceworker', {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint
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
          return fetch('unregister-serviceworker', {
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
