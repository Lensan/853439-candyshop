'use strict';

(function () {
  var ESCAPE_KEY = 'Escape';

  var successElement = document.querySelector('.modal:last-of-type');
  var errorElement = document.querySelector('.modal:first-of-type');

  var closePopup = function () {
    successElement.classList.add('modal--hidden');
    errorElement.classList.add('modal--hidden');
    var closeElement = window.modal.closeElement;
    closeElement.removeEventListener('click', onCloseButtonClick);
    document.removeEventListener('keydown', onEscButtonKeyDown);
  };

  var onCloseButtonClick = function () {
    closePopup();
  };

  var onEscButtonKeyDown = function (evt) {
    if (evt.key === ESCAPE_KEY) {
      closePopup();
    }
  };

  var openPopup = function (modalElement) {
    modalElement.classList.remove('modal--hidden');
    var closeElement = modalElement.querySelector('.modal__close');
    closeElement.addEventListener('click', onCloseButtonClick);
    window.modal.closeElement = closeElement;
    document.addEventListener('keydown', onEscButtonKeyDown);
  };

  window.modal = {
    closeElement: '',
    onSuccessLoad: function () {
      openPopup(successElement);
      window.order.setFormToDefaultValues(false);
      window.goods.changeMainBasketHeader([]);
    },
    onErrorLoad: function (errorMessage) {
      errorElement.querySelector('.modal__message:first-of-type').textContent = errorMessage;
      openPopup(errorElement);
      if (window.goods.checkOrderDataIsEmpty()) {
        window.order.setFormToDefaultValues(true);
      }
      if (!window.catalog.cardsElement.querySelector('.catalog__card')) {
        window.filter.disableAllFilterElements();
      }
    }
  };
})();
