'use strict';

(function () {
  var ESCAPE_KEY = 'Escape';

  var successElement = document.querySelector('.modal:last-of-type');
  var errorElement = document.querySelector('.modal:first-of-type');

  var closeModalPopup = function () {
    successElement.classList.add('modal--hidden');
    errorElement.classList.add('modal--hidden');
    var closeElement = window.modal.closeElement;
    closeElement.removeEventListener('click', onCloseButtonClick);
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
    var closeElement = modalElement.querySelector('.modal__close');
    closeElement.addEventListener('click', onCloseButtonClick);
    window.modal.closeElement = closeElement;
    document.addEventListener('keydown', onEscButtonPress);
  };

  window.modal = {
    closeElement: '',
    onSuccessLoad: function () {
      openModalPopup(successElement);
      window.form.setFormToDefaultValues(false);
      window.goods.changeMainBasketHeader(window.goods.goodsOrderedTotal);
    },
    onErrorLoad: function (errorMessage) {
      errorElement.querySelector('.modal__message:first-of-type').textContent = errorMessage;
      openModalPopup(errorElement);
      if (window.goods.checkOrderDataIsEmpty(window.goods.goodCardsElement)) {
        window.form.setFormToDefaultValues(true);
      }
      if (!window.catalog.catalogCardsElement.querySelector('.catalog__card')) {
        window.form.enableDisableFormInputs(window.filter.catalogSideBarElement, 'none', true);
        window.filter.catalogSideBarElement.querySelectorAll('button').forEach(function (button) {
          button.disabled = true;
        });
      }
    }
  };
})();
