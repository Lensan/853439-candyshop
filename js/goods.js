'use strict';

(function () {
  var getGoodFromInitialData = function (goodName, newObjectRequired) {
    var goodsInitialData = window.catalog.goodsDataTotal;
    var goodData = goodsInitialData.find(function (good) {
      return goodName === good.name;
    });
    goodData = newObjectRequired ? Object.assign({}, goodData) : goodData;
    return goodData;
  };

  var getCardDataForOrder = function (cardElement) {
    var cardData = {};
    if (!cardElement.classList.contains(window.catalog.CARD_SOON_CLASS)) {
      cardData = getGoodFromInitialData(cardElement.querySelector('.card__title').textContent, true);
    }
    return cardData;
  };

  var goodCardsElement = document.querySelector('.goods__cards');

  var increaseGoodOrderedCount = function (goodData) {
    var goodsOrdered = goodCardsElement.querySelectorAll('.card-order');
    var goodOrderedElement = Array.from(goodsOrdered).find(function (good) {
      return good.querySelector('.card-order__title').textContent === goodData.name;
    });
    var goodOrderedCountElement = goodOrderedElement.querySelector('.card-order__count');
    if ((parseInt(goodOrderedCountElement.value, 10) + 1) <= goodData.amount) {
      goodOrderedCountElement.value = parseInt(goodOrderedCountElement.value, 10) + 1;
    }
  };

  var changeMainBasketHeader = function (goodsStats) {
    var mainBasketHeaderElement = document.querySelector('.main-header__basket');
    if (goodsStats.countTotal) {
      mainBasketHeaderElement.textContent = 'В корзине ' + goodsStats.countTotal + ' товаров на сумму ' + goodsStats.costTotal + ' ₽';
    } else {
      mainBasketHeaderElement.textContent = 'В корзине ничего нет';
    }
  };

  var goodsOrderedTotal = [];
  var checkAddGoodInOrderArray = function (goodData) {
    var isGoodFound = goodsOrderedTotal.some(function (data) {
      return data.name === goodData.name;
    });
    if (!isGoodFound) {
      goodsOrderedTotal.push(goodData);
    }
    return isGoodFound;
  };

  var checkObjectIsEmpty = function (object) {
    return Object.keys(object).length === 0;
  };

  var createAndRenderOrderCard = function (cardElement) {
    goodsOrderedTotal = window.goods.orderedTotal;
    var goodOrderedData = getCardDataForOrder(cardElement);
    if (!checkObjectIsEmpty(goodOrderedData)) {
      var isGoodOrdered = checkAddGoodInOrderArray(goodOrderedData);
      if (!isGoodOrdered) {
        var orderCardElement = renderOrderCard(goodOrderedData);

        var orderCloseButton = orderCardElement.querySelector('.card-order__close');
        orderCloseButton.addEventListener('click', onOrderCloseButtonClick);

        var orderDecreaseButton = orderCardElement.querySelector('.card-order__btn--decrease');
        orderDecreaseButton.addEventListener('click', onOrderIncreaseDecreaseCountButtonClick);

        var orderIncreaseButton = orderCardElement.querySelector('.card-order__btn--increase');
        orderIncreaseButton.addEventListener('click', onOrderIncreaseDecreaseCountButtonClick);

        var orderCountButton = orderCardElement.querySelector('.card-order__count');
        orderCountButton.addEventListener('click', onOrderIncreaseDecreaseCountButtonClick);
        orderCountButton.addEventListener('keyup', onOrderCountButtonKeyUp);
      } else {
        increaseGoodOrderedCount(goodOrderedData);
      }
      var goodsOrderedStats = getOrderCardsStats();
      changeMainBasketHeader(goodsOrderedStats);
    }
  };

  var removeGoodFromTotalArray = function (goodName) {
    var goodIndex = goodsOrderedTotal.findIndex(function (good) {
      return good.name === goodName;
    });
    if (goodIndex !== -1) {
      goodsOrderedTotal.splice(goodIndex, 1);
    }
  };

  var removeGoodFromOrder = function (targetElement) {
    var cardOrderElement = window.catalog.getParentElement(targetElement, 'card-order');
    if (cardOrderElement) {
      cardOrderElement.parentNode.removeChild(cardOrderElement);
      changeGoodCardsElement();
      changeFormElements(false);
      removeGoodFromTotalArray(cardOrderElement.querySelector('.card-order__title').textContent);
    }
  };

  var checkOrderCountForIncrease = function (countElement, goodOrderedName) {
    return goodsOrderedTotal.some(function (good) {
      return good.name === goodOrderedName && (parseInt(countElement.value, 10) + 1) <= good.amount;
    });
  };

  var reduceOrderCountIfExceeded = function (countElement, goodOrderedName) {
    var goodCountExceeded = goodsOrderedTotal.find(function (good) {
      return good.name === goodOrderedName && parseInt(countElement.value, 10) > good.amount;
    });
    if (goodCountExceeded) {
      countElement.value = goodCountExceeded.amount;
    }
  };

  var changeOrderCount = function (targetElement) {
    var goodsCardElement = window.catalog.getParentElement(targetElement, 'goods_card');
    if (goodsCardElement) {
      var cardOrderTitle = goodsCardElement.querySelector('.card-order__title').textContent;
      var cardOrderCountElement = goodsCardElement.querySelector('.card-order__count');
      var cardOrderCountElementValue = parseInt(cardOrderCountElement.value, 10);
      if (targetElement.classList.contains('card-order__btn--increase') && checkOrderCountForIncrease(cardOrderCountElement, cardOrderTitle)) {
        cardOrderCountElement.value = cardOrderCountElementValue + 1;
      } else {
        if (targetElement.classList.contains('card-order__btn--decrease')) {
          cardOrderCountElement.value = cardOrderCountElementValue - 1;
        } else if (targetElement.classList.contains('card-order__count') && cardOrderCountElementValue) {
          reduceOrderCountIfExceeded(cardOrderCountElement, cardOrderTitle);
        }
        cardOrderCountElementValue = parseInt(cardOrderCountElement.value, 10);
        if (cardOrderCountElementValue <= 0 || !cardOrderCountElementValue) {
          removeGoodFromOrder(targetElement);
        }
      }
    }
  };

  var onOrderCloseButtonClick = function (evt) {
    evt.preventDefault();
    removeGoodFromOrder(evt.target);
    var goodsOrderedStats = getOrderCardsStats();
    changeMainBasketHeader(goodsOrderedStats);
  };

  var onOrderIncreaseDecreaseCountButtonClick = function (evt) {
    evt.preventDefault();
    changeOrderCount(evt.target);
    var goodsOrderedStats = getOrderCardsStats();
    changeMainBasketHeader(goodsOrderedStats);
  };

  var onOrderCountButtonKeyUp = function (evt) {
    evt.preventDefault();
    changeOrderCount(evt.target);
    var goodsOrderedStats = getOrderCardsStats();
    changeMainBasketHeader(goodsOrderedStats);
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

  var checkOrderDataIsEmpty = function () {
    return !goodCardsElement.querySelector('.card-order');
  };

  var getOrderCardsStats = function () {
    var orderStats = {
      countTotal: 0,
      costTotal: 0
    };
    if (!checkOrderDataIsEmpty()) {
      var orderCountElements = goodCardsElement.querySelectorAll('.card-order__count');
      var orderPriceElements = goodCardsElement.querySelectorAll('.card-order__price');
      orderCountElements.forEach(function (goodCount, i) {
        var count = parseInt(goodCount.value, 10);
        orderStats.countTotal += count;
        var price = parseInt(getRegexpValue(orderPriceElements[i].textContent, '\\d+'), 10);
        orderStats.costTotal += count * price;
      });
    }
    return orderStats;
  };

  var changeGoodCardsElement = function (isOrderEmpty) {
    var orderEmptyState = isOrderEmpty ? isOrderEmpty : checkOrderDataIsEmpty();
    if (orderEmptyState) {
      goodCardsElement.classList.toggle('goods__cards--empty');
      goodCardsElement.querySelector('.goods__card-empty').classList.toggle('visually-hidden');
    }
  };

  var changeFormElements = function (isOrderInitEmpty) {
    if (checkOrderDataIsEmpty()) {
      window.order.setFormToDefaultValues(true);
    } else if (isOrderInitEmpty) {
      window.order.enableFormElements();
    }
  };

  var renderOrderCard = function (goodOrdered) {
    var cardOrderTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');
    var cardElement = createOrderCard(cardOrderTemplate, goodOrdered);
    var orderInitState = checkOrderDataIsEmpty();
    changeGoodCardsElement(orderInitState);
    goodCardsElement.appendChild(cardElement);
    changeFormElements(orderInitState);
    return cardElement;
  };

  window.goods = {
    orderedTotal: goodsOrderedTotal,
    cardsElement: goodCardsElement,
    changeMainBasketHeader: changeMainBasketHeader,
    changeGoodCardsElement: changeGoodCardsElement,
    createAndRenderOrderCard: createAndRenderOrderCard,
    checkOrderDataIsEmpty: checkOrderDataIsEmpty,
    getRegexpValue: getRegexpValue,
    getGoodFromInitialData: getGoodFromInitialData
  };
})();
