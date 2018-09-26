'use strict';

(function () {
  var checkCardWithLune = function (cardNumber) {
    var isValid = true;
    var sum = 0;
    var cardNumbers = cardNumber.split('');
    for (var i = 0; i < cardNumbers.length; i++) {
      cardNumbers[i] = parseInt(cardNumbers[i], 10);
      if ((i + 1) % 2 !== 0) {
        cardNumbers[i] *= 2;
      }
      if (cardNumbers[i] >= 10) {
        cardNumbers[i] -= 9;
      }
      sum += cardNumbers[i];
    }
    if (sum % 10 !== 0) {
      isValid = false;
    }
    return isValid;
  };

  var addErrorClass = function (element) {
    element.parentNode.classList.add('text-input--error');
  };

  var removeErrorClass = function (element) {
    element.parentNode.classList.remove('text-input--error');
  };

  var checkElementValidity = function (element) {
    if (element.validity.valueMissing) {
      element.setCustomValidity('Поле не должно быть пустым!');
      addErrorClass(element);
    } else if (element.validity.patternMismatch) {
      if (element.id === 'payment__card-number') {
        element.setCustomValidity('Введите номер банковской карты в правильном формате: 16 цифр');
      } else if (element.id === 'payment__card-date') {
        element.setCustomValidity('Введите срок действия карты в правильном формате: мм/гг');
      } else {
        element.setCustomValidity('Неправильный формат данных!');
      }
      addErrorClass(element);
    } else if (element.validity.typeMismatch) {
      element.setCustomValidity('Введите почтовый адрес в правильном формате');
      addErrorClass(element);
    } else {
      element.setCustomValidity('');
      removeErrorClass(element);
    }
    return element.validity.valid;
  };

  var checkBankCardValidity = function (element) {
    var isCardNumberValid = checkCardWithLune(element.value);
    if (!isCardNumberValid) {
      element.setCustomValidity('Невалидный номер банковской карты!');
      addErrorClass(element);
    } else {
      element.setCustomValidity('');
      removeErrorClass(element);
    }
  };

  var checkInputElementsTotal = function () {
    var inputElements = buyElement.querySelectorAll('input[class="text-input__input"]');
    for (var i = 0; i < inputElements.length; i++) {
      var isElementValid = checkElementValidity(inputElements[i]);
      if (inputElements[i].id === 'payment__card-number' && isElementValid) {
        checkBankCardValidity(inputElements[i]);
      }
    }
  };

  var onContactDataInputFieldsBlur = function (evt) {
    var targetElement = evt.target;
    if (!targetElement.validity.valid) {
      document.querySelector('#buy-form').reportValidity();
    }
    checkElementValidity(targetElement);
  };

  var onBankCardInputFieldsBlur = function (evt) {
    var targetElement = evt.target;
    if (!targetElement.validity.valid) {
      document.querySelector('#buy-form').reportValidity();
    }
    var isElementValid = checkElementValidity(targetElement);
    if (targetElement.id === 'payment__card-number' && isElementValid) {
      checkBankCardValidity(targetElement);
    }
  };

  var onDeliveryInputFieldsBlur = function (evt) {
    var targetElement = evt.target;
    if (!targetElement.validity.valid) {
      document.querySelector('#buy-form').reportValidity();
    }
    checkElementValidity(targetElement);
  };

  var onUserInputFieldsInput = function (evt) {
    var targetElement = evt.target;
    if (targetElement.type !== 'radio') {
      targetElement.setCustomValidity('');
      removeErrorClass(targetElement);
    }
  };

  var onSubmitButtonClick = function (evt) {
    checkInputElementsTotal(evt);
  };

  var switchTabs = function (evt, element, class1, class2, method) {
    if (evt.target.id) {
      var classToUnhide = element.querySelector('.' + evt.target.id + '-wrap') ? '.' + evt.target.id + '-wrap' : '.' + evt.target.id;
      element.querySelector(classToUnhide).classList.remove('visually-hidden');
      var inputsToEnable = element.querySelector(classToUnhide).querySelectorAll('input');
      for (var j = 0; j < inputsToEnable.length; j++) {
        inputsToEnable[j].disabled = false;
      }
    } else {
      element.querySelector(class1).classList.add('visually-hidden');
      element.querySelector(class2).classList.add('visually-hidden');
      var elementInputs = element.querySelectorAll('input');
      for (var i = 0; i < elementInputs.length; i++) {
        if (elementInputs[i].name !== method) {
          elementInputs[i].disabled = true;
        }
      }
    }
  };

  var onPaymentTabClick = function (evt) {
    switchTabs(evt, paymentElement, '.payment__card-wrap', '.payment__cash-wrap', 'pay-method');
  };

  var onDeliveryTabClick = function (evt) {
    switchTabs(evt, deliveryElement, '.deliver__store', '.deliver__courier', 'method-deliver');
  };

  var buyElement = document.querySelector('#buy-form');
  buyElement.addEventListener('input', onUserInputFieldsInput);

  var contactDataInputsElement = buyElement.querySelector('.contact-data__inputs');
  contactDataInputsElement.addEventListener('blur', onContactDataInputFieldsBlur, true);

  var paymentInputsElement = buyElement.querySelector('.payment__inputs');
  paymentInputsElement.addEventListener('blur', onBankCardInputFieldsBlur, true);

  var deliveryElement = buyElement.querySelector('.deliver');
  var deliveryCourierElement = deliveryElement.querySelector('.deliver__courier');
  deliveryCourierElement.addEventListener('blur', onDeliveryInputFieldsBlur, true);

  var submitButtonElement = buyElement.querySelector('.buy__submit-btn');
  submitButtonElement.addEventListener('click', onSubmitButtonClick);

  var paymentElement = buyElement.querySelector('.payment');
  var paymentMethodElement = paymentElement.querySelector('.payment__method');
  paymentMethodElement.addEventListener('click', onPaymentTabClick);

  var deliveryToggleElement = deliveryElement.querySelector('.deliver__toggle');
  deliveryToggleElement.addEventListener('click', onDeliveryTabClick);
})();
