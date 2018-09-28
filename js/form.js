'use strict';

(function () {
  var switchTabsToDefaultValues = function (element, class1, class2) {
    element.querySelector(class1).classList.add('visually-hidden');
    element.querySelector(class2).classList.remove('visually-hidden');
    element.querySelector('.toggle-btn__input:first-of-type').checked = true;
  };

  window.form = {
    enableDisableFormInputs: function (element, inputClass, isDisabled) {
      var input = (inputClass === 'none') ? 'input' : 'input[class*="' + inputClass + '"]';
      var elementInputs = element.querySelectorAll(input);
      for (var i = 0; i < elementInputs.length; i++) {
        elementInputs[i].disabled = isDisabled;
      }
    }
  };

  var removeAllGoodsFromOrder = function () {
    var goodsOrderedTotal = window.goods.goodCardsElement.querySelectorAll('.card-order');
    for (var i = 0; i < goodsOrderedTotal.length; i++) {
      goodsOrderedTotal[i].parentNode.removeChild(goodsOrderedTotal[i]);
    }
  };

  var revertDeliveryStoreElement = function (element) {
    var deliverStoreFirstInput = element.querySelector('.input-btn__input--radio:first-of-type');
    var deliverStoreFirstLabel = element.querySelector('.input-btn__label:first-of-type');
    deliverStoreFirstInput.checked = true;
    window.order.deliveryStoreMapImgElement.src = window.order.PATH_TO_MAP + deliverStoreFirstInput.value + '.jpg';
    window.order.deliveryStoreMapImgElement.alt = deliverStoreFirstLabel.textContent;
    window.order.deliveryStoreDescribeElement.textContent = window.order.AddressMap[deliverStoreFirstInput.value];
  };

  var deliverStoreElement = window.order.buyElement.querySelector('.deliver__store');

  window.form.setFormToDefaultValues = function (isInitial) {
    var inputElements = window.order.formInputElements;
    if (!isInitial) {
      // clean the basket
      removeAllGoodsFromOrder();
      window.goods.changeGoodCardsElement(window.goods.goodCardsElement);
      window.goods.goodsOrderedTotal = [];
      for (var i = 0; i < inputElements.length; i++) {
        inputElements[i].value = '';
        window.order.removeErrorClass(inputElements[i]);
      }
      window.order.buyElement.querySelector('.deliver__textarea').value = '';
    }
    switchTabsToDefaultValues(window.order.paymentElement, '.payment__cash-wrap', '.payment__card-wrap');
    switchTabsToDefaultValues(window.order.deliveryElement, '.deliver__courier', '.deliver__store');
    revertDeliveryStoreElement(deliverStoreElement);
    window.form.enableDisableFormInputs(window.order.buyElement, 'none', true);
    window.order.submitButtonElement.disabled = true;
  };

  window.form.enableFormElements = function () {
    window.form.enableDisableFormInputs(window.order.contactDataInputsElement, 'text-input__input', false);
    window.form.enableDisableFormInputs(window.order.paymentInputsElement, 'text-input__input', false);
    window.form.enableDisableFormInputs(window.order.buyElement, 'toggle-btn__input', false);
    window.form.enableDisableFormInputs(deliverStoreElement, 'input-btn__input', false);
    window.order.submitButtonElement.disabled = false;
  };
})();
