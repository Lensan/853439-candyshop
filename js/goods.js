'use strict';

(function () {
  var getGoodFromInitialData = function (name) {
    var goodData = {};
    for (var i = 0; i < window.catalog.goodsDataTotal.length; i++) {
      if (name === window.catalog.goodsDataTotal[i].name) {
        goodData = Object.assign(goodData, window.catalog.goodsDataTotal[i]);
      }
    }
    return goodData;
  };

  var getCardDataForOrder = function (evt) {
    var cardElement = window.catalog.getParentElement(evt, 'catalog__card');
    var cardData = {};
    if (!cardElement.classList.contains(window.data.CARD_SOON_CLASS)) {
      cardData = getGoodFromInitialData(cardElement.querySelector('.card__title').textContent);
    }
    return cardData;
  };

  var increaseGoodOrderedCount = function (goodData) {
    var goodsOrderedTotal = document.querySelectorAll('.card-order');
    for (var i = 0; i < goodsOrderedTotal.length; i++) {
      var goodTitle = goodsOrderedTotal[i].querySelector('.card-order__title').textContent;
      if (goodTitle === goodData.name) {
        var goodOrderedElement = goodsOrderedTotal[i].querySelector('.card-order__count');
        if ((parseInt(goodOrderedElement.value, 10) + 1) <= goodData.amount) {
          goodOrderedElement.value = parseInt(goodOrderedElement.value, 10) + 1;
        }
      }
    }
  };

  var changeMainBasketHeader = function (goodsData) {
    var mainBasketHeaderElement = document.querySelector('.main-header__basket');
    if (goodsData.goodsCountTotal > 0) {
      mainBasketHeaderElement.textContent = 'В корзине ' + goodsData.goodsCountTotal + ' товаров на сумму ' + goodsData.goodsCostTotal + ' ₽';
    } else {
      mainBasketHeaderElement.textContent = 'В корзине ничего нет';
    }
  };

  window.goods = {
    goodsOrderedTotal: []
  };
  var checkAddGoodInOrderArray = function (goodData) {
    var isGoodInOrder = false;
    var goodsOrdered = window.goods.goodsOrderedTotal;
    for (var i = 0; i < goodsOrdered.length; i++) {
      if (goodsOrdered[i].name === goodData.name) {
        isGoodInOrder = true;
      }
    }
    if (!isGoodInOrder) {
      goodsOrdered.push(goodData);
    }
    return isGoodInOrder;
  };

  var checkObjectIsEmpty = function (obj) {
    return Object.keys(obj).length === 0;
  };

  window.goods.createAndRenderOrderCard = function (evt) {
    var goodOrderedData = getCardDataForOrder(evt);
    if (!checkObjectIsEmpty(goodOrderedData)) {
      var isGoodOrdered = checkAddGoodInOrderArray(goodOrderedData);
      if (!isGoodOrdered) {
        var orderCardElement = renderOrderCard(goodOrderedData);

        var orderCloseButton = orderCardElement.querySelector('.card-order__close');
        orderCloseButton.addEventListener('click', onOrderCloseButtonClickOrPress);

        var orderDecreaseButton = orderCardElement.querySelector('.card-order__btn--decrease');
        orderDecreaseButton.addEventListener('click', onOrderCountButtonsClickOrPress);

        var orderIncreaseButton = orderCardElement.querySelector('.card-order__btn--increase');
        orderIncreaseButton.addEventListener('click', onOrderCountButtonsClickOrPress);

        var orderCountButton = orderCardElement.querySelector('.card-order__count');
        orderCountButton.addEventListener('click', onOrderCountButtonsClickOrPress);
        orderCountButton.addEventListener('keyup', onOrderCountButtonsClickOrPress);
      } else {
        increaseGoodOrderedCount(goodOrderedData);
      }
      var goodsOrderedData = checkOrderCardsData(document.querySelector('.goods__cards'));
      changeMainBasketHeader(goodsOrderedData);
    }
  };

  var removeGoodFromTotalArray = function (goodName) {
    var goodsOrdered = window.goods.goodsOrderedTotal;
    for (var i = 0; i < goodsOrdered.length; i++) {
      if (goodsOrdered[i].name === goodName) {
        goodsOrdered.splice(i, 1);
      }
    }
  };

  var removeGoodFromOrder = function (evt) {
    var cardOrderElement = window.catalog.getParentElement(evt, 'card-order');
    cardOrderElement.parentNode.removeChild(cardOrderElement);
    changeGoodCardsElement(document.querySelector('.goods__cards'));
    removeGoodFromTotalArray(cardOrderElement.querySelector('.card-order__title').textContent);
  };

  var checkOrderCountForIncrease = function (countElement, goodOrderedName) {
    var isOrderCountToBeIncreased = false;
    var goodsOrderedData = window.goods.goodsOrderedTotal;
    for (var i = 0; i < goodsOrderedData.length; i++) {
      if (goodsOrderedData[i].name === goodOrderedName && (parseInt(countElement.value, 10) + 1) <= goodsOrderedData[i].amount) {
        isOrderCountToBeIncreased = true;
      }
    }
    return isOrderCountToBeIncreased;
  };

  var reduceOrderCountIfIncreased = function (countElement, goodOrderedName) {
    var goodsOrderedData = window.goods.goodsOrderedTotal;
    for (var i = 0; i < goodsOrderedData.length; i++) {
      if (goodsOrderedData[i].name === goodOrderedName && parseInt(countElement.value, 10) > goodsOrderedData[i].amount) {
        countElement.value = goodsOrderedData[i].amount;
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

  var onOrderCloseButtonClickOrPress = function (evt) {
    evt.preventDefault();
    removeGoodFromOrder(evt);
    var goodsOrderedData = checkOrderCardsData(document.querySelector('.goods__cards'));
    changeMainBasketHeader(goodsOrderedData);
  };

  var onOrderCountButtonsClickOrPress = function (evt) {
    evt.preventDefault();
    increaseDecreaseCheckOrderCount(evt);
    var goodsOrderedData = checkOrderCardsData(document.querySelector('.goods__cards'));
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
    var goodId = getRegexpValue(order.picture, '.+(?=\\.)');
    goodId = getRegexpValue(goodId, '(?<=\\/)\\w+.\\w+$');
    cardCountElement.name = goodId;
    cardCountElement.value = 1;
    cardCountElement.id = 'card-order__' + goodId;
    return card;
  };

  var checkOrderCardsData = function (element) {
    var goodsOrderedData = {};
    goodsOrderedData.goodsCountTotal = 0;
    goodsOrderedData.goodsCostTotal = 0;
    if (element.querySelector('.card-order')) {
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
    if (checkOrderCardsData(element).goodsCountTotal === 0) {
      element.classList.toggle('goods__cards--empty');
      element.querySelector('.goods__card-empty').classList.toggle('visually-hidden');
    }
  };

  var renderOrderCard = function (goodOrdered) {
    var cardOrderTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');
    var cardElement = createOrderCard(cardOrderTemplate, goodOrdered);

    var goodCardsElement = document.querySelector('.goods__cards');
    changeGoodCardsElement(goodCardsElement);
    goodCardsElement.appendChild(cardElement);
    return cardElement;
  };
})();
