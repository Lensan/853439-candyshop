'use strict';

(function () {
  var ESCAPE_KEY = 'Escape';

  window.modal = {
    successElement: document.querySelector('.modal:last-of-type'),
    errorElement: document.querySelector('.modal:first-of-type')
  };

  var closeModalPopup = function () {
    window.modal.successElement.classList.add('modal--hidden');
    window.modal.errorElement.classList.add('modal--hidden');
    window.modal.closeElement.removeEventListener('click', onCloseButtonClick);
    document.removeEventListener('keydown', onEscButtonPress);
  };

  var onCloseButtonClick = function () {
    closeModalPopup();
  };

  var onEscButtonPress = function (evt) {
    if (evt.key === ESCAPE_KEY) {
      closeModalPopup();
    }
  };

  var openModalPopup = function (modalElement) {
    modalElement.classList.remove('modal--hidden');
    window.modal.closeElement = modalElement.querySelector('.modal__close');
    window.modal.closeElement.addEventListener('click', onCloseButtonClick);
    document.addEventListener('keydown', onEscButtonPress);
  };

  window.modal.onSuccessLoad = function () {
    openModalPopup(window.modal.successElement);
    window.form.setFormToDefaultValues(false);
    window.goods.changeMainBasketHeader(window.goods.goodsOrderedTotal);
  };

  window.modal.onErrorLoad = function (errorMessage) {
    window.modal.errorElement.querySelector('.modal__message:first-of-type').textContent = errorMessage;
    openModalPopup(window.modal.errorElement);
  };
})();
