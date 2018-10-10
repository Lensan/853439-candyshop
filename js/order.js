'use strict';

(function () {
  var PATH_TO_MAP = 'img/map/';
  var CARD_ACCEPTED_STATUS = 'Одобрен';
  var CARD_DEFAULT_STATUS = 'Не определён';
  var AddressMap = {
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
  };

  var checkCardWithLune = function (cardNumber) {
    var isValid = true;
    var sum = 0;
    var cardNumbers = cardNumber.split('');
    cardNumbers.forEach(function (digit, i) {
      digit = parseInt(digit, 10);
      if ((i + 1) % 2 !== 0) {
        digit *= 2;
      }
      if (digit >= 10) {
        digit -= 9;
      }
      sum += digit;
    });
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
      } else if (element.id === 'payment__card-cvc') {
        element.setCustomValidity('Введите CVC карты в правильном формате: от 100 до 999');
      } else {
        element.setCustomValidity('Неправильный формат данных!');
      }
      addErrorClass(element);
    } else if (element.validity.typeMismatch) {
      element.setCustomValidity('Введите почтовый адрес в правильном формате');
      addErrorClass(element);
    } else if (element.validity.customError) {
      element.setCustomValidity('Невалидный номер банковской карты!');
      addErrorClass(element);
    } else {
      element.setCustomValidity('');
      removeErrorClass(element);
    }
    return element.validity.valid;
  };

  var checkInputElementsTotal = function () {
    var inputsTotalValid = true;
    var isElementValid = true;
    var isCardValid = true;
    var inputElements = Array.from(formInputElements);
    inputElements.forEach(function (input) {
      if (!input.disabled) {
        if (input.id === 'payment__card-number') {
          isCardValid = checkCardWithLune(input.value);
          if (!isCardValid) {
            input.setCustomValidity('error');
          }
        }
        isElementValid = checkElementValidity(input);
        if (!isElementValid || !isCardValid) {
          inputsTotalValid = false;
        }
      }
    });
    return inputsTotalValid;
  };

  var onContactDataInputsElementBlur = function (evt) {
    var targetElement = evt.target;
    checkElementValidity(targetElement);
  };

  var onPaymentInputsElementBlur = function (evt) {
    var targetElement = evt.target;
    if (targetElement.id === 'payment__card-number') {
      var isCardNumberValid = checkCardWithLune(targetElement.value);
      if (!isCardNumberValid) {
        targetElement.setCustomValidity('error');
      }
    }
    checkElementValidity(targetElement);
    paymentInputsElementInputs = Array.from(paymentInputsElementInputs);
    var arePaymentInputsValid = paymentInputsElementInputs.every(function (input) {
      return input.validity.valid;
    });
    buyElement.querySelector('.payment__card-status').textContent = (arePaymentInputsValid) ? CARD_ACCEPTED_STATUS : CARD_DEFAULT_STATUS;
  };

  var onDeliveryCourierElementBlur = function (evt) {
    var targetElement = evt.target;
    checkElementValidity(targetElement);
  };

  var onBuyElementInput = function (evt) {
    var targetElement = evt.target;
    if (targetElement.type !== 'radio') {
      targetElement.setCustomValidity('');
      removeErrorClass(targetElement);
    }
  };

  var switchTabs = function (evt, tabElement, class1, class2) {
    var targetId = evt.target.htmlFor;
    var input = buyElement.querySelector('#' + targetId);
    if (input) {
      if (!input.disabled) {
        tabElement.querySelector(class1).classList.add('visually-hidden');
        tabElement.querySelector(class2).classList.add('visually-hidden');
        enableDisableFormInputs(tabElement, 'text-input__input', true);
        deliveryTextAreaElement.disabled = true;
        enableDisableFormInputs(tabElement, 'input-btn__input--radio', true);

        var classToUnhide = tabElement.querySelector('.' + targetId + '-wrap') ? '.' + targetId + '-wrap' : '.' + targetId;
        tabElement.querySelector(classToUnhide).classList.remove('visually-hidden');
        if (input.id === 'payment__card' || input.id === 'deliver__courier') {
          var elementToEnableInputs = tabElement.querySelector(classToUnhide);
          enableDisableFormInputs(elementToEnableInputs, 'text-input__input', false);
          if (input.id === 'deliver__courier') {
            deliveryTextAreaElement.disabled = false;
          }
        } else if (input.id === 'deliver__store') {
          enableDisableFormInputs(tabElement, 'input-btn__input--radio', false);
        }
      }
    }
  };

  var onPaymentMethodElementClick = function (evt) {
    switchTabs(evt, paymentElement, '.payment__card-wrap', '.payment__cash-wrap');
  };

  var onDeliveryToggleElementClick = function (evt) {
    switchTabs(evt, deliveryElement, '.deliver__store', '.deliver__courier');
  };

  var targetInnerHTML = '';
  var onDeliveryStoreListElementClick = function (evt) {
    if (evt.target.value) {
      if (!evt.target.disabled) {
        deliveryStoreMapImgElement.src = PATH_TO_MAP + evt.target.value + '.jpg';
        deliveryStoreMapImgElement.alt = targetInnerHTML;
        targetInnerHTML = '';
        deliveryStoreDescribeElement.textContent = AddressMap[evt.target.value];
      }
    } else {
      targetInnerHTML = evt.target.innerHTML;
    }
  };

  var buyElement = document.querySelector('#buy-form');
  buyElement.addEventListener('input', onBuyElementInput);
  var formInputElements = buyElement.querySelectorAll('input[class="text-input__input"]');

  var contactDataInputsElement = buyElement.querySelector('.contact-data__inputs');
  contactDataInputsElement.addEventListener('blur', onContactDataInputsElementBlur, true);

  var paymentInputsElement = buyElement.querySelector('.payment__inputs');
  var paymentInputsElementInputs = paymentInputsElement.querySelectorAll('input');
  paymentInputsElement.addEventListener('blur', onPaymentInputsElementBlur, true);

  var deliveryElement = buyElement.querySelector('.deliver');
  var deliveryStoreMapImgElement = deliveryElement.querySelector('.deliver__store-map-img');
  var deliveryStoreDescribeElement = deliveryElement.querySelector('.deliver__store-describe');
  var deliveryCourierElement = deliveryElement.querySelector('.deliver__courier');
  var deliveryTextAreaElement = deliveryCourierElement.querySelector('.deliver__textarea');
  deliveryCourierElement.addEventListener('blur', onDeliveryCourierElementBlur, true);

  var paymentElement = buyElement.querySelector('.payment');
  var paymentMethodElement = paymentElement.querySelector('.payment__method');
  paymentMethodElement.addEventListener('click', onPaymentMethodElementClick);

  var deliveryToggleElement = deliveryElement.querySelector('.deliver__toggle');
  deliveryToggleElement.addEventListener('click', onDeliveryToggleElementClick);

  var deliveryStoreListElement = deliveryElement.querySelector('.deliver__store-list');
  deliveryStoreListElement.addEventListener('click', onDeliveryStoreListElementClick);

  var onBuySubmitButtonClick = function (evt) {
    var isFormValid = checkInputElementsTotal();
    if (isFormValid) {
      window.backend.save(new FormData(buyElement), window.modal.onSuccessLoad, window.modal.onErrorLoad);
      evt.preventDefault();
    }
  };
  var buySubmitButtonElement = buyElement.querySelector('.buy__submit-btn');
  buySubmitButtonElement.addEventListener('click', onBuySubmitButtonClick);

  // clean order form after submit
  var switchTabsToDefaultValues = function (tabElement, classToHide, classToUnhide) {
    tabElement.querySelector(classToHide).classList.add('visually-hidden');
    tabElement.querySelector(classToUnhide).classList.remove('visually-hidden');
    tabElement.querySelector('.toggle-btn__input:first-of-type').checked = true;
  };

  var enableDisableFormInputs = function (inputsElement, inputClass, isDisabled) {
    var input = (inputClass === 'none') ? 'input' : 'input[class*="' + inputClass + '"]';
    var elementInputs = inputsElement.querySelectorAll(input);
    elementInputs = Array.from(elementInputs);
    elementInputs.forEach(function (input1) {
      input1.disabled = isDisabled;
    });
  };

  var removeAllGoodsCards = function (cardsElement, cardClass) {
    var goodsCardsTotal = cardsElement.querySelectorAll(cardClass);
    goodsCardsTotal = Array.from(goodsCardsTotal);
    goodsCardsTotal.forEach(function (card) {
      card.parentNode.removeChild(card);
    });
  };

  var deliverStoreElement = buyElement.querySelector('.deliver__store');
  var deliverStoreFirstInput = deliverStoreElement.querySelector('.input-btn__input--radio:first-of-type');
  var deliverStoreFirstLabel = deliverStoreElement.querySelector('.input-btn__label:first-of-type');

  var revertDeliveryStoreElement = function () {
    deliverStoreFirstInput.checked = true;
    deliveryStoreMapImgElement.src = PATH_TO_MAP + deliverStoreFirstInput.value + '.jpg';
    deliveryStoreMapImgElement.alt = deliverStoreFirstLabel.textContent;
    deliveryStoreDescribeElement.textContent = AddressMap[deliverStoreFirstInput.value];
  };

  window.order = {
    enableDisableFormInputs: enableDisableFormInputs,
    removeAllGoodsCards: removeAllGoodsCards,
    enableFormElements: function () {
      enableDisableFormInputs(contactDataInputsElement, 'text-input__input', false);
      enableDisableFormInputs(paymentInputsElement, 'text-input__input', false);
      enableDisableFormInputs(buyElement, 'toggle-btn__input', false);
      enableDisableFormInputs(deliverStoreElement, 'input-btn__input', false);
      buySubmitButtonElement.disabled = false;
    },
    setFormToDefaultValues: function (isInitial) {
      if (!isInitial) {
        // clean the basket
        removeAllGoodsCards(window.goods.cardsElement, '.card-order');
        window.goods.changeGoodCardsElement();
        window.goods.orderedTotal = [];
        var inputElements = Array.from(formInputElements);
        inputElements.forEach(function (input) {
          input.value = '';
          removeErrorClass(input);
        });
        deliveryTextAreaElement.value = '';
      }
      switchTabsToDefaultValues(paymentElement, '.payment__cash-wrap', '.payment__card-wrap');
      switchTabsToDefaultValues(deliveryElement, '.deliver__courier', '.deliver__store');
      revertDeliveryStoreElement(deliverStoreElement);
      enableDisableFormInputs(buyElement, 'none', true);
      buyElement.querySelector('.payment__card-status').textContent = '';
      deliveryTextAreaElement.disabled = true;
      buySubmitButtonElement.disabled = true;
    }
  };
})();
