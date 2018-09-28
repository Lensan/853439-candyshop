'use strict';

(function () {
  window.order = {
    PATH_TO_MAP: 'img/map/',
    AddressMap: {
      'academicheskaya': 'проспект Науки, д. 19, корп. 3, литер А, ТК «Платформа», 3-й этаж, секция 310',
      'vasileostrovskaya': 'Средний проспект В.О., д. 27',
      'rechka': 'улица Савушкина, д. 7',
      'petrogradskaya': 'улица Льва Толстого, д. 4',
      'proletarskaya': 'проспект Обуховской Обороны, д. 227',
      'vostaniya': 'улица Гончарная, д. 11',
      'prosvesheniya': 'проспект Просвещения, д. 62',
      'frunzenskaya': 'Московский проспект, д. 65',
      'chernishevskaya': 'Кирочная улица, д. 14',
      'tehinstitute': '1-я Красноармейская улица, д. 4'
    }
  };

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

  window.order.removeErrorClass = function (element) {
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
      } else if (element.id === 'payment__card-cvc') {
        element.setCustomValidity('Введите CVC карты в правильном формате: от 100 до 999');
      } else {
        element.setCustomValidity('Неправильный формат данных!');
      }
      addErrorClass(element);
    } else if (element.validity.typeMismatch) {
      element.setCustomValidity('Введите почтовый адрес в правильном формате');
      addErrorClass(element);
    } else {
      element.setCustomValidity('');
      window.order.removeErrorClass(element);
    }
    return element.validity.valid;
  };

  var checkBankCardValidity = function (element) {
    var isCardNumberValid = checkCardWithLune(element.value);
    if (!isCardNumberValid) {
      element.setCustomValidity('Невалидный номер банковской карты!');
      addErrorClass(element);
    }
    return isCardNumberValid;
  };

  var checkInputElementsTotal = function () {
    var inputsTotalValid = true;
    var inputElements = window.order.formInputElements;
    for (var i = 0; i < inputElements.length; i++) {
      if (!inputElements[i].disabled) {
        var isElementValid = checkElementValidity(inputElements[i]);
        if (inputElements[i].id === 'payment__card-number' && isElementValid) {
          isElementValid = checkBankCardValidity(inputElements[i]);
        }
        if (!isElementValid) {
          inputsTotalValid = false;
        }
      }
    }
    return inputsTotalValid;
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
      window.order.buyElement.reportValidity();
    }
    var isElementValid = checkElementValidity(targetElement);
    if (targetElement.id === 'payment__card-number' && isElementValid) {
      checkBankCardValidity(targetElement);
    }
  };

  var onDeliveryInputFieldsBlur = function (evt) {
    var targetElement = evt.target;
    if (!targetElement.validity.valid) {
      window.order.buyElement.reportValidity();
    }
    checkElementValidity(targetElement);
  };

  var onUserInputFieldsInput = function (evt) {
    var targetElement = evt.target;
    if (targetElement.type !== 'radio') {
      targetElement.setCustomValidity('');
      window.order.removeErrorClass(targetElement);
    }
  };

  var switchTabs = function (evt, element, class1, class2) {
    var targetId = evt.target.htmlFor;
    var inputId = window.order.buyElement.querySelector('#' + targetId);
    if (inputId) {
      if (!inputId.disabled) {
        element.querySelector(class1).classList.add('visually-hidden');
        element.querySelector(class2).classList.add('visually-hidden');
        window.form.enableDisableFormInputs(element, 'text-input__input', true);

        var classToUnhide = element.querySelector('.' + targetId + '-wrap') ? '.' + targetId + '-wrap' : '.' + targetId;
        element.querySelector(classToUnhide).classList.remove('visually-hidden');
        var elementToEnableInputs = element.querySelector(classToUnhide);
        window.form.enableDisableFormInputs(elementToEnableInputs, 'text-input__input', false);
      }
    }
  };

  var onPaymentTabClick = function (evt) {
    switchTabs(evt, window.order.paymentElement, '.payment__card-wrap', '.payment__cash-wrap');
  };

  var onDeliveryTabClick = function (evt) {
    switchTabs(evt, window.order.deliveryElement, '.deliver__store', '.deliver__courier');
  };

  window.order.targetInnerHTML = '';
  var onDeliveryStoreItemClick = function (evt) {
    var deliveryStoreImgElement = window.order.deliveryStoreMapImgElement;
    if (evt.target.value) {
      if (!evt.target.disabled) {
        deliveryStoreImgElement.src = window.order.PATH_TO_MAP + evt.target.value + '.jpg';
        deliveryStoreImgElement.alt = window.order.targetInnerHTML;
        window.order.targetInnerHTML = '';
        window.order.deliveryStoreDescribeElement.textContent = window.order.AddressMap[evt.target.value];
      }
    } else {
      window.order.targetInnerHTML = evt.target.innerHTML;
    }
  };

  window.order.buyElement = document.querySelector('#buy-form');
  window.order.buyElement.addEventListener('input', onUserInputFieldsInput);
  window.order.formInputElements = window.order.buyElement.querySelectorAll('input[class="text-input__input"]');

  window.order.contactDataInputsElement = window.order.buyElement.querySelector('.contact-data__inputs');
  window.order.contactDataInputsElement.addEventListener('blur', onContactDataInputFieldsBlur, true);

  window.order.paymentInputsElement = window.order.buyElement.querySelector('.payment__inputs');
  window.order.paymentInputsElement.addEventListener('blur', onBankCardInputFieldsBlur, true);

  window.order.deliveryElement = window.order.buyElement.querySelector('.deliver');
  window.order.deliveryStoreMapImgElement = window.order.deliveryElement.querySelector('.deliver__store-map-img');
  window.order.deliveryStoreDescribeElement = window.order.deliveryElement.querySelector('.deliver__store-describe');
  var deliveryCourierElement = window.order.deliveryElement.querySelector('.deliver__courier');
  deliveryCourierElement.addEventListener('blur', onDeliveryInputFieldsBlur, true);

  window.order.paymentElement = window.order.buyElement.querySelector('.payment');
  var paymentMethodElement = window.order.paymentElement.querySelector('.payment__method');
  paymentMethodElement.addEventListener('click', onPaymentTabClick);

  var deliveryToggleElement = window.order.deliveryElement.querySelector('.deliver__toggle');
  deliveryToggleElement.addEventListener('click', onDeliveryTabClick);

  var deliveryStoreListElement = window.order.deliveryElement.querySelector('.deliver__store-list');
  deliveryStoreListElement.addEventListener('click', onDeliveryStoreItemClick);

  var onSubmitButtonClick = function (evt) {
    var isFormValid = checkInputElementsTotal(evt);
    if (isFormValid) {
      window.backend.save(new FormData(window.order.buyElement), window.modal.onSuccessLoad, window.modal.onErrorLoad);
      evt.preventDefault();
    }
  };
  window.order.submitButtonElement = window.order.buyElement.querySelector('.buy__submit-btn');
  window.order.submitButtonElement.addEventListener('click', onSubmitButtonClick);
})();
