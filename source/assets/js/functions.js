// Check the browser to make sure it supports service workers
if('serviceWorker' in navigator) {
  navigator.serviceWorker
    // Register the path to the service worker file
    .register('')
    .then(function() { console.log("Service Worker Registered"); });
}

// This build system utilizes the jQuery library for javascript.
// Don't want to use jQuery? Just don't load it on the main pages
// You can also erase this and start writing vanilla JS

$(document).ready(function() {

  // Write your jQuery here

});
