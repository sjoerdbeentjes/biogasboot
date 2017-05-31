(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

if ('serviceWorker' in navigator) {

  // As subscription object is needed in few places let's create a method which
  // returns a promise.
  var getSubscription = function getSubscription() {
    return navigator.serviceWorker.ready.then(function (registration) {
      return registration.pushManager.getSubscription();
    });
  };

  // Register service worker and check the initial subscription state.
  // Set the UI (button) according to the status.


  // Get the `registration` from service worker and create a new
  // subscription using `registration.pushManager.subscribe`. Then
  // register received new subscription by sending a POST request with its
  // endpoint to the server.
  var subscribe = function subscribe() {
    navigator.serviceWorker.ready.then(function (registration) {
      return registration.pushManager.subscribe({ userVisibleOnly: true });
    }).then(function (subscription) {
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
  };

  // Get existing subscription from service worker, unsubscribe
  // (`subscription.unsubscribe()`) and unregister it in the server with
  // a POST request to stop sending push messages to
  // unexisting endpoint.


  var unsubscribe = function unsubscribe() {
    getSubscription().then(function (subscription) {
      return subscription.unsubscribe().then(function () {
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
  };

  // Change the subscription button's text and action.


  var setSubscribeButton = function setSubscribeButton() {
    subscriptionButton.onclick = subscribe;
    subscriptionButton.textContent = 'Subscribe!';
  };

  var setUnsubscribeButton = function setUnsubscribeButton() {
    subscriptionButton.onclick = unsubscribe;
    subscriptionButton.textContent = 'Unsubscribe!';
  };

  // [Working example](/push-subscription-management_demo.html).
  var subscriptionButton = document.getElementById('subscriptionButton');if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').then(function () {
      console.log('service worker registered');
      subscriptionButton.removeAttribute('disabled');
    });
    getSubscription().then(function (subscription) {
      if (subscription) {
        console.log('Already subscribed', subscription.endpoint);
        setUnsubscribeButton();
      } else {
        setSubscribeButton();
      }
    });
  }
}

},{}]},{},[1]);
