'use strict';

(function () {
  var getGoodFromInitialData = function (name, newObjRequired) {
    var goodData = {};
    var goodInitialData = window.catalog.goodsDataTotal;
    for (var i = 0; i < goodInitialData.length; i++) {
      if (name === goodInitialData[i].name) {
        goodData = newObjRequired ? Object.assign(goodData, goodInitialData[i]) : goodInitialData[i];
      }
    }
    return goodData;
  };

  var getCardDataForOrder = function (evt) {
    var cardElement = window.catalog.getParentElement(evt, 'catalog__card');
    var cardData = {};
    if (!cardElement.classList.contains(window.catalog.CARD_SOON_CLASS)) {
      cardData = getGoodFromInitialData(cardElement.querySelector('.card__title').textContent, true);
    }
    return cardData;
  };

  var goodCardsElement = document.querySelector('.goods__cards');

  var increaseGoodOrderedCount = function (goodData) {
    var goodsOrdered = goodCardsElement.querySelectorAll('.card-order');
    for (var i = 0; i < goodsOrdered.length; i++) {
      var goodTitle = goodsOrdered[i].querySelector('.card-order__title').textContent;
      if (goodTitle === goodData.name) {
        var goodOrderedElement = goodsOrdered[i].querySelector('.card-order__count');
        if ((parseInt(goodOrderedElement.value, 10) + 1) <= goodData.amount) {
          goodOrderedElement.value = parseInt(goodOrderedElement.value, 10) + 1;
        }
      }
    }
  };

  var changeMainBasketHeader = function (goodsData) {
    var mainBasketHeaderElement = document.querySelector('.main-header__basket');
    if (goodsData.goodsCountTotal) {
      mainBasketHeaderElement.textContent = 'В корзине ' + goodsData.goodsCountTotal + ' товаров на сумму ' + goodsData.goodsCostTotal + ' ₽';
    } else {
      mainBasketHeaderElement.textContent = 'В корзине ничего нет';
    }
  };

  var goodsOrderedTotal = [];
  var checkAddGoodInOrderArray = function (goodData) {
    var isGoodInOrder = false;
    for (var i = 0; i < goodsOrderedTotal.length; i++) {
      if (goodsOrderedTotal[i].name === goodData.name) {
        isGoodInOrder = true;
      }
    }
    if (!isGoodInOrder) {
      goodsOrderedTotal.push(goodData);
    }
    return isGoodInOrder;
  };

  var checkObjectIsEmpty = function (obj) {
    return Object.keys(obj).length === 0;
  };

  var createAndRenderOrderCard = function (evt) {
    goodsOrderedTotal = window.goods.goodsOrderedTotal;
    var goodOrderedData = getCardDataForOrder(evt);
    if (!checkObjectIsEmpty(goodOrderedData)) {
      var isGoodOrdered = checkAddGoodInOrderArray(goodOrderedData);
      if (!isGoodOrdered) {
        var orderCardElement = renderOrderCard(goodOrderedData);

        var orderCloseButton = orderCardElement.querySelector('.card-order__close');
        orderCloseButton.addEventListener('click', onOrderCloseButtonClick);

        var orderDecreaseButton = orderCardElement.querySelector('.card-order__btn--decrease');
        orderDecreaseButton.addEventListener('click', onOrderCountButtonsClick);

        var orderIncreaseButton = orderCardElement.querySelector('.card-order__btn--increase');
        orderIncreaseButton.addEventListener('click', onOrderCountButtonsClick);

        var orderCountButton = orderCardElement.querySelector('.card-order__count');
        orderCountButton.addEventListener('click', onOrderCountButtonsClick);
        orderCountButton.addEventListener('keyup', onOrderCountButtonsClick);
      } else {
        increaseGoodOrderedCount(goodOrderedData);
      }
      var goodsOrderedData = checkOrderCardsData(goodCardsElement);
      changeMainBasketHeader(goodsOrderedData);
    }
  };

  var removeGoodFromTotalArray = function (goodName) {
    for (var i = 0; i < goodsOrderedTotal.length; i++) {
      if (goodsOrderedTotal[i].name === goodName) {
        goodsOrderedTotal.splice(i, 1);
      }
    }
  };

  var removeGoodFromOrder = function (evt) {
    var cardOrderElement = window.catalog.getParentElement(evt, 'card-order');
    cardOrderElement.parentNode.removeChild(cardOrderElement);
    var initialGoodCount = changeGoodCardsElement(goodCardsElement);
    changeFormElements(goodCardsElement, initialGoodCount);
    removeGoodFromTotalArray(cardOrderElement.querySelector('.card-order__title').textContent);
  };

  var checkOrderCountForIncrease = function (countElement, goodOrderedName) {
    var isOrderCountToBeIncreased = false;
    for (var i = 0; i < goodsOrderedTotal.length; i++) {
      if (goodsOrderedTotal[i].name === goodOrderedName && (parseInt(countElement.value, 10) + 1) <= goodsOrderedTotal[i].amount) {
        isOrderCountToBeIncreased = true;
      }
    }
    return isOrderCountToBeIncreased;
  };

  var reduceOrderCountIfIncreased = function (countElement, goodOrderedName) {
    for (var i = 0; i < goodsOrderedTotal.length; i++) {
      if (goodsOrderedTotal[i].name === goodOrderedName && parseInt(countElement.value, 10) > goodsOrderedTotal[i].amount) {
        countElement.value = goodsOrderedTotal[i].amount;
      }
    }
  };

  var increaseDecreaseCheckOrderCount = function (evt) {
    var goodsCardElement = window.catalog.getParentElement(evt, 'goods_card');
    var cardOrderTitle = goodsCardElement.querySelector('.card-order__title').textContent;
    var cardOrderCountElement = goodsCardElement.querySelector('.card-order__count');
    if (evt.target.classList.contains('card-order__btn--increase') && checkOrderCountForIncrease(cardOrderCountElement, cardOrderTitle)) {
      cardOrderCountElement.value = parseInt(cardOrderCountElement.value, 10) + 1;
    } else {
      if (evt.target.classList.contains('card-order__btn--decrease')) {
        cardOrderCountElement.value = parseInt(cardOrderCountElement.value, 10) - 1;
      }
      if (parseInt(cardOrderCountElement.value, 10) <= 0 || !parseInt(cardOrderCountElement.value, 10)) {
        removeGoodFromOrder(evt);
      } else {
        reduceOrderCountIfIncreased(cardOrderCountElement, cardOrderTitle);
      }
    }
  };

  var onOrderCloseButtonClick = function (evt) {
    evt.preventDefault();
    removeGoodFromOrder(evt);
    var goodsOrderedData = checkOrderCardsData(goodCardsElement);
    changeMainBasketHeader(goodsOrderedData);
  };

  var onOrderCountButtonsClick = function (evt) {
    evt.preventDefault();
    increaseDecreaseCheckOrderCount(evt);
    var goodsOrderedData = checkOrderCardsData(goodCardsElement);
    changeMainBasketHeader(goodsOrderedData);
  };

  var getRegexpValue = function (value, expression) {
    var regexpValue = '';
    var regexp = new RegExp(expression);
    var result = value.match(regexp);
    if (result) {
      regexpValue = result[0];
    }
    return regexpValue;
  };

  var createOrderCard = function (template, order) {
    var card = template.cloneNode(true);
    card.querySelector('.card-order__title').textContent = order.name;
    var cardImageElement = card.querySelector('.card-order__img');
    cardImageElement.src = order.picture;
    cardImageElement.alt = order.name;
    card.querySelector('.card-order__price').textContent = order.price;
    var cardCountElement = card.querySelector('.card-order__count');
    cardCountElement.name = order.id;
    cardCountElement.value = 1;
    cardCountElement.id = 'card-order__' + order.id;
    return card;
  };

  var checkOrderDataIsEmpty = function (element) {
    return !element.querySelector('.card-order');
  };

  var checkOrderCardsData = function (element) {
    var goodsOrderedData = {};
    goodsOrderedData.goodsCountTotal = 0;
    goodsOrderedData.goodsCostTotal = 0;
    if (!checkOrderDataIsEmpty(element)) {
      var orderCountElements = element.querySelectorAll('.card-order__count');
      var orderPriceElements = element.querySelectorAll('.card-order__price');
      for (var i = 0; i < orderCountElements.length; i++) {
        var count = parseInt(orderCountElements[i].value, 10);
        goodsOrderedData.goodsCountTotal += count;
        var price = parseInt(getRegexpValue(orderPriceElements[i].textContent, '\\d+'), 10);
        goodsOrderedData.goodsCostTotal += count * price;
      }
    }
    return goodsOrderedData;
  };

  var changeGoodCardsElement = function (element) {
    var isGoodCardsEmpty = checkOrderDataIsEmpty(element);
    if (isGoodCardsEmpty) {
      element.classList.toggle('goods__cards--empty');
      element.querySelector('.goods__card-empty').classList.toggle('visually-hidden');
    }
    return isGoodCardsEmpty;
  };

  var changeFormElements = function (element, isOrderInitEmpty) {
    if (checkOrderDataIsEmpty(element)) {
      window.form.setFormToDefaultValues(true);
    } else if (isOrderInitEmpty) {
      window.form.enableFormElements();
    }
  };

  var renderOrderCard = function (goodOrdered) {
    var cardOrderTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');
    var cardElement = createOrderCard(cardOrderTemplate, goodOrdered);
    var orderInitState = changeGoodCardsElement(goodCardsElement);
    goodCardsElement.appendChild(cardElement);
    changeFormElements(goodCardsElement, orderInitState);
    return cardElement;
  };

  window.goods = {
    goodsOrderedTotal: goodsOrderedTotal,
    goodCardsElement: goodCardsElement,
    changeMainBasketHeader: changeMainBasketHeader,
    changeGoodCardsElement: changeGoodCardsElement,
    createAndRenderOrderCard: createAndRenderOrderCard,
    checkOrderDataIsEmpty: checkOrderDataIsEmpty,
    getRegexpValue: getRegexpValue,
    getGoodFromInitialData: getGoodFromInitialData
  };
})();
