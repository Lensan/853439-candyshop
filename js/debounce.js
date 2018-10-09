'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 300; // ms

  window.debounce = function (callback) {
    var lastTimeout = null;

    return function () {
      var args = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      var functionToApply = function () {
        callback.apply(null, args);
      };
      lastTimeout = window.setTimeout(functionToApply, DEBOUNCE_INTERVAL);
    };
  };
})();
