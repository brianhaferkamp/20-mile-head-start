if('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('') // path to service worker
    .then(function() { console.log("Service Worker Registered"); });
}

// This build system utilizes the jQuery library for javascript.
// Don't want to use jQuery? Just don't load it on the main pages
// You can also erase this and start writing vanilla JS

$(document).ready(function() {

  // Write your jQuery here

});
