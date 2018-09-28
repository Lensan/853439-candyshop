'use strict';

(function () {
  var URL_SAVE = 'https://js.dump.academy/candyshop';
  var URL_LOAD = URL_SAVE + '/data';
  var CONNECTION_ERROR = 'Ошибка соединения.';
  var SUCCESS_CODE = 200;

  var getTimeoutError = function (timeout) {
    return 'Запрос не успел выполниться за ' + timeout + 'мс.';
  };

  var getErrorMessage = function (errorStatus) {
    return 'Код ошибки: ' + errorStatus + '.';
  };

  window.backend = {
    save: function (data, onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === SUCCESS_CODE) {
          onLoad(xhr.response);
        } else {
          onError(getErrorMessage(xhr.status));
        }
      });

      xhr.addEventListener('error', function () {
        onError(CONNECTION_ERROR);
      });

      xhr.addEventListener('timeout', function () {
        onError(getTimeoutError(xhr.timeout));
      });

      xhr.open('POST', URL_SAVE);
      xhr.send(data);
    },

    load: function (onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.open('GET', URL_LOAD);

      xhr.addEventListener('load', function () {
        if (xhr.status === SUCCESS_CODE) {
          onLoad(xhr.response);
        } else {
          onError(getErrorMessage(xhr.status));
        }
      });

      xhr.addEventListener('error', function () {
        onError(CONNECTION_ERROR);
      });

      xhr.addEventListener('timeout', function () {
        onError(getTimeoutError(xhr.timeout));
      });

      xhr.send();
    }
  };
})();
