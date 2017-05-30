(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

if ("serviceWorker" in navigator) {
  var endpoint = void 0;

  // Register a Service Worker.
  navigator.serviceWorker.register('service-worker.js').then(function (registration) {
    // Use the PushManager to get the user's subscription to the push service.
    return registration.pushManager.getSubscription().then(function (subscription) {
      // If a subscription was found, return it.
      if (subscription) {
        return subscription;
      }

      // Otherwise, subscribe the user (userVisibleOnly allows to specify that we don't plan to
      // send notifications that don't have a visible effect for the user).
      return registration.pushManager.subscribe({ userVisibleOnly: true });
    });
  }).then(function (subscription) {
    endpoint = subscription.endpoint;
    // Send the subscription details to the server using the Fetch API.
    fetch('./register', {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint
      })
    });
  });
  // source: https://serviceworke.rs/push-rich.html
}

},{}]},{},[1]);
