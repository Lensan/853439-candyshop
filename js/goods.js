'use strict';

var GOOD_NAMES = ['Чесночные сливки', 'Огуречный педант', 'Молочная хрюша', 'Грибной шейк', 'Баклажановое безумие', 'Паприколу итальяно', 'Нинзя-удар васаби', 'Хитрый баклажан', 'Горчичный вызов', 'Кедровая липучка', 'Корманный портвейн', 'Чилийский задира', 'Беконовый взрыв', 'Арахис vs виноград', 'Сельдерейная душа', 'Початок в бутылке', 'Чернющий мистер чеснок', 'Раша федераша', 'Кислая мина', 'Кукурузное утро', 'Икорный фуршет', 'Новогоднее настроение', 'С пивком потянет', 'Мисс креветка', 'Бесконечный взрыв', 'Невинные винные', 'Бельгийское пенное', 'Острый язычок'];
var GOOD_PICTURES = ['gum-cedar', 'gum-chile', 'gum-eggplant', 'gum-mustard', 'gum-portwine', 'gum-wasabi', 'ice-cucumber', 'ice-eggplant', 'ice-garlic', 'ice-italian', 'ice-mushroom', 'ice-pig', 'marmalade-beer', 'marmalade-caviar', 'marmalade-corn', 'marmalade-new-year', 'marmalade-sour', 'marshmallow-bacon', 'marshmallow-beer', 'marshmallow-shrimp', 'marshmallow-spicy', 'marshmallow-wine', 'soda-bacon', 'soda-celery', 'soda-cob', 'soda-garlic', 'soda-peanut-grapes', 'soda-russian'];
var GOOD_CONTENTS = ['молоко', 'сливки', 'вода', 'пищевой краситель', 'патока', 'ароматизатор бекона', 'ароматизатор свинца', 'ароматизатор дуба, идентичный натуральному', 'ароматизатор картофеля', 'лимонная кислота', 'загуститель', 'эмульгатор', 'консервант: сорбат калия', 'посолочная смесь: соль, нитрит натрия', 'ксилит', 'карбамид', 'вилларибо', 'виллабаджо'];

var GOOD_IN_STOCK_AMOUNT = 5;
var GOOD_LITTLE_AMOUNT = 1;
var GOOD_NONE_AMOUNT = 0;

var CARD_IN_STOCK_CLASS = 'card--in-stock';
var CARD_LITTLE_CLASS = 'card--little';
var CARD_SOON_CLASS = 'card--soon';

var GOOD_MIN_AMOUNT = 0;
var GOOD_MAX_AMOUNT = 20;

var GOOD_MIN_PRICE = 100;
var GOOD_MAX_PRICE = 1500;

var GOOD_MIN_WEIGHT = 30;
var GOOD_MAX_WEIGHT = 300;

var GOOD_MIN_RATING_VALUE = 1;
var GOOD_MAX_RATING_VALUE = 5;

var GOOD_MIN_RATING_NUMBER = 10;
var GOOD_MAX_RATING_NUMBER = 900;

var GOOD_MIN_ENERGY = 70;
var GOOD_MAX_ENERGY = 500;

var GOODS_AMOUNT_TOTAL = 26;
var PATH_TO_PIC = 'img/cards/';
var NUMBER_OF_REPETITIONS = 100;
var GOOD_CONTENT_MAX_AMOUNT = 8;

var ENTER_KEY = 'Enter';

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
};

var getRandomIndexesArray = function (indexesAmount, arrayLength) {
  var indexesInUse = [];
  for (var i = 0; i < indexesAmount; i++) {
    var indexRequired = true;
    var j = 0;
    while (indexRequired && j < NUMBER_OF_REPETITIONS) {
      var index = getRandomNumber(0, arrayLength - 1);
      var k = 0;
      indexRequired = false;
      while (!indexRequired && k < indexesInUse.length) {
        if (index === indexesInUse[k]) {
          indexRequired = true;
        }
        k++;
      }
      j++;
    }
    indexesInUse.push(index);
  }
  return indexesInUse;
};

var getParentElement = function (evt, className) {
  var element = evt.target;
  var isElementFound = false;
  while (!isElementFound && element.parentNode.nodeName !== '#document') {
    element = element.parentNode;
    if (element.classList.contains(className)) {
      isElementFound = true;
    }
  }
  return element;
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

var checkObjectIsEmpty = function (obj) {
  return Object.keys(obj).length === 0;
};

var generateGoodContent = function (contents) {
  var contentAmount = getRandomNumber(1, GOOD_CONTENT_MAX_AMOUNT);
  var content = '';
  var indexes = getRandomIndexesArray(contentAmount, contents.length);
  for (var i = 0; i < indexes.length; i++) {
    content += contents[indexes[i]];
    if (i !== indexes.length - 1) {
      content += ', ';
    }
  }
  return content;
};

var generateGoodsData = function (amount, names, pictures, contents) {
  var goods = [];
  amount = Math.min(amount, names.length, pictures.length);
  var indexes = getRandomIndexesArray(amount, Math.min(names.length, pictures.length));
  for (var i = 0; i < amount; i++) {
    var good = {};
    good.name = names[indexes[i]];
    good.picture = PATH_TO_PIC + pictures[indexes[i]] + '.jpg';
    good.amount = getRandomNumber(GOOD_MIN_AMOUNT, GOOD_MAX_AMOUNT);
    good.price = getRandomNumber(GOOD_MIN_PRICE, GOOD_MAX_PRICE);
    good.weight = getRandomNumber(GOOD_MIN_WEIGHT, GOOD_MAX_WEIGHT);
    good.rating = {};
    good.rating.value = getRandomNumber(GOOD_MIN_RATING_VALUE, GOOD_MAX_RATING_VALUE);
    good.rating.number = getRandomNumber(GOOD_MIN_RATING_NUMBER, GOOD_MAX_RATING_NUMBER);
    good.nutritionFacts = {};
    good.nutritionFacts.sugar = !!getRandomNumber(0, 1);
    good.nutritionFacts.energy = getRandomNumber(GOOD_MIN_ENERGY, GOOD_MAX_ENERGY);
    good.nutritionFacts.contents = generateGoodContent(contents);
    goods.push(good);
  }
  return goods;
};

var getCardClass = function (goodAmount) {
  var cardClass = '';
  if (goodAmount > GOOD_IN_STOCK_AMOUNT) {
    cardClass = CARD_IN_STOCK_CLASS;
  } else if (goodAmount >= GOOD_LITTLE_AMOUNT && goodAmount <= GOOD_IN_STOCK_AMOUNT) {
    cardClass = CARD_LITTLE_CLASS;
  } else if (goodAmount === GOOD_NONE_AMOUNT) {
    cardClass = CARD_SOON_CLASS;
  }
  return cardClass;
};

var getStarsRating = function (rating) {
  var starsRatings = ['one', 'two', 'three', 'four', 'five'];
  return 'stars__rating--' + starsRatings[rating - 1];
};

var addRemoveClass = function (classList, className, oldClass, newClass) {
  var classListInitial = className.split(' ');
  var isClassFound = false;
  for (var i = 0; i < classListInitial.length; i++) {
    var item = classListInitial[i];
    if (item.includes(oldClass)) {
      if (!isClassFound && item === newClass) {
        isClassFound = true;
      } else {
        classList.remove(item);
      }
    }
  }
  if (!isClassFound) {
    classList.add(newClass);
  }
};

var createCatalogCard = function (template, good) {
  var card = template.cloneNode(true);
  addRemoveClass(card.classList, card.className, 'card--', getCardClass(good.amount));
  card.querySelector('.card__title').textContent = good.name;
  var cardImageElement = card.querySelector('.card__img');
  cardImageElement.src = good.picture;
  cardImageElement.alt = good.name;
  card.querySelector('.card__price').innerHTML = good.price + ' <span class="card__currency">₽</span><span class="card__weight">/ ' + good.weight + ' Г</span>';
  var starsRatingElement = card.querySelector('.stars__rating');
  addRemoveClass(starsRatingElement.classList, starsRatingElement.className, 'stars__rating--', getStarsRating(good.rating.value));
  card.querySelector('.star__count').textContent = '(' + good.rating.number + ')';
  card.querySelector('.card__characteristic').textContent = (good.nutritionFacts.sugar ? 'Содержит сахар' : 'Без сахара') + '. ' + good.nutritionFacts.energy + ' ккал';
  card.querySelector('.card__composition-list').textContent = good.nutritionFacts.contents + '.';
  return card;
};

var renderCatalogCardsTotal = function (goodAmount, goodNames, goodPictures, goodContents, cardsElement) {
  var catalogCardTemplate = document.querySelector('#card').content.querySelector('.catalog__card');
  var goodData = generateGoodsData(goodAmount, goodNames, goodPictures, goodContents);
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < goodData.length; i++) {
    var cardElement = createCatalogCard(catalogCardTemplate, goodData[i]);
    fragment.appendChild(cardElement);
  }
  cardsElement.appendChild(fragment);
  return goodData;
};

var catalogCardsWrapElement = document.querySelector('.catalog__cards-wrap');
var catalogCardsElement = catalogCardsWrapElement.querySelector('.catalog__cards');

document.addEventListener('DOMContentLoaded', function () {
  catalogCardsElement.classList.remove('catalog__cards--load');
  catalogCardsWrapElement.querySelector('.catalog__load').classList.add('visually-hidden');
  window.goodsDataTotal = renderCatalogCardsTotal(GOODS_AMOUNT_TOTAL, GOOD_NAMES, GOOD_PICTURES, GOOD_CONTENTS, catalogCardsElement);
  catalogCardsElement.addEventListener('click', onCatalogCardElementClick);
});

var addRemoveCardComposition = function (element) {
  element.querySelector('.card__composition').classList.toggle('card__composition--hidden');
};

var addRemoveCardFavorite = function (evt) {
  evt.target.classList.toggle('card__btn-favorite--selected');
  evt.target.blur();
};

var onCatalogCardElementClick = function (evt) {
  var targetElement = evt.target;
  var cardElement = getParentElement(evt, 'catalog__card');
  if (targetElement.classList.contains('card__btn-composition')) {
    addRemoveCardComposition(cardElement);
  } else if (targetElement.classList.contains('card__btn-favorite')) {
    evt.preventDefault();
    addRemoveCardFavorite(evt);
  } else if (targetElement.classList.contains('card__btn')) {
    evt.preventDefault();
    createAndRenderOrderCard(evt);
  }
};

var getGoodFromInitialData = function (name) {
  var goodData = {};
  for (var i = 0; i < window.goodsDataTotal.length; i++) {
    if (name === window.goodsDataTotal[i].name) {
      goodData = Object.assign(goodData, window.goodsDataTotal[i]);
    }
  }
  return goodData;
};

var getCardDataForOrder = function (evt) {
  var cardElement = getParentElement(evt, 'catalog__card');
  var cardData = {};
  if (!cardElement.classList.contains(CARD_SOON_CLASS)) {
    cardData = getGoodFromInitialData(cardElement.querySelector('.card__title').textContent);
  }
  return cardData;
};

var addSingleButtonListener = function (button, action, mouseEvent, keyboardEvent) {
  button.addEventListener(mouseEvent, action);
  button.addEventListener(keyboardEvent, action);
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

window.goodsOrderedTotal = [];
var checkAddGoodInOrderArray = function (goodData) {
  var isGoodInOrder = false;
  var goodsOrdered = window.goodsOrderedTotal;
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

var createAndRenderOrderCard = function (evt) {
  var goodOrderedData = getCardDataForOrder(evt);
  if (!checkObjectIsEmpty(goodOrderedData)) {
    var isGoodOrdered = checkAddGoodInOrderArray(goodOrderedData);
    if (!isGoodOrdered) {
      var orderCardElement = renderOrderCard(goodOrderedData);

      var orderCloseButton = orderCardElement.querySelector('.card-order__close');
      addSingleButtonListener(orderCloseButton, onOrderCloseButtonClickOrPress, 'click', 'keydown');

      var orderDecreaseButton = orderCardElement.querySelector('.card-order__btn--decrease');
      addSingleButtonListener(orderDecreaseButton, onOrderCountButtonsClickOrPress, 'click', 'keydown');

      var orderIncreaseButton = orderCardElement.querySelector('.card-order__btn--increase');
      addSingleButtonListener(orderIncreaseButton, onOrderCountButtonsClickOrPress, 'click', 'keydown');

      var orderCountButton = orderCardElement.querySelector('.card-order__count');
      addSingleButtonListener(orderCountButton, onOrderCountButtonsClickOrPress, 'click', 'keyup');
    } else {
      increaseGoodOrderedCount(goodOrderedData);
    }
    var goodsOrderedData = checkOrderCardsData(document.querySelector('.goods__cards'));
    changeMainBasketHeader(goodsOrderedData);
  }
};

var removeGoodFromTotalArray = function (goodName) {
  var goodsOrdered = window.goodsOrderedTotal;
  for (var i = 0; i < goodsOrdered.length; i++) {
    if (goodsOrdered[i].name === goodName) {
      goodsOrdered.splice(i, 1);
    }
  }
};

var removeGoodFromOrder = function (evt) {
  var cardOrderElement = getParentElement(evt, 'card-order');
  cardOrderElement.parentNode.removeChild(cardOrderElement);
  changeGoodCardsElement(document.querySelector('.goods__cards'));
  removeGoodFromTotalArray(cardOrderElement.querySelector('.card-order__title').textContent);
};

var checkOrderCountForIncrease = function (countElement, goodOrderedName) {
  var isOrderCountToBeIncreased = false;
  var goodsOrderedData = window.goodsOrderedTotal;
  for (var i = 0; i < goodsOrderedData.length; i++) {
    if (goodsOrderedData[i].name === goodOrderedName && (parseInt(countElement.value, 10) + 1) <= goodsOrderedData[i].amount) {
      isOrderCountToBeIncreased = true;
    }
  }
  return isOrderCountToBeIncreased;
};

var reduceOrderCountIfIncreased = function (countElement, goodOrderedName) {
  var goodsOrderedData = window.goodsOrderedTotal;
  for (var i = 0; i < goodsOrderedData.length; i++) {
    if (goodsOrderedData[i].name === goodOrderedName && parseInt(countElement.value, 10) > goodsOrderedData[i].amount) {
      countElement.value = goodsOrderedData[i].amount;
    }
  }
};

var increaseDecreaseCheckOrderCount = function (evt) {
  var goodsCardElement = getParentElement(evt, 'goods_card');
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
  if (evt.type === 'click' || (evt.type === 'keydown' && evt.key === ENTER_KEY)) {
    evt.preventDefault();
    removeGoodFromOrder(evt);
    var goodsOrderedData = checkOrderCardsData(document.querySelector('.goods__cards'));
    changeMainBasketHeader(goodsOrderedData);
  }
};

var onOrderCountButtonsClickOrPress = function (evt) {
  if (evt.type === 'click' || evt.type === 'keyup' || (evt.type === 'keydown' && evt.key === ENTER_KEY)) {
    evt.preventDefault();
    increaseDecreaseCheckOrderCount(evt);
    var goodsOrderedData = checkOrderCardsData(document.querySelector('.goods__cards'));
    changeMainBasketHeader(goodsOrderedData);
  }
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

// FORM VALIDATION AND MANIPULATION FILE
var checkInputElementsTotal = function () {
  var inputElements = buyElement.querySelectorAll('input[class="text-input__input"]');
  for (var i = 0; i < inputElements.length; i++) {
    var isElementValid = checkElementValidity(inputElements[i]);
    if (inputElements[i].id === 'payment__card-number' && isElementValid) {
      checkBankCardValidity(inputElements[i]);
    }
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

var onContactDataInputFieldsInput = function (evt) {
  var targetElement = evt.target;
  if (!targetElement.validity.valid) {
    document.querySelector('#buy-form').reportValidity();
  }
  checkElementValidity(targetElement);
};

var onBankCardInputFieldsInput = function (evt) {
  var targetElement = evt.target;
  if (!targetElement.validity.valid) {
    document.querySelector('#buy-form').reportValidity();
  }
  var isElementValid = checkElementValidity(targetElement);
  if (targetElement.id === 'payment__card-number' && isElementValid) {
    checkBankCardValidity(targetElement);
  }
};

var onDeliveryInputFieldsInput = function (evt) {
  var targetElement = evt.target;
  if (!targetElement.validity.valid) {
    document.querySelector('#buy-form').reportValidity();
  }
  checkElementValidity(targetElement);
};

var onUserInputFieldsStartInput = function (evt) {
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
buyElement.addEventListener('input', onUserInputFieldsStartInput);

var contactDataInputsElement = buyElement.querySelector('.contact-data__inputs');
contactDataInputsElement.addEventListener('blur', onContactDataInputFieldsInput, true);

var paymentInputsElement = buyElement.querySelector('.payment__inputs');
paymentInputsElement.addEventListener('blur', onBankCardInputFieldsInput, true);

var deliveryElement = buyElement.querySelector('.deliver');
var deliveryCourierElement = deliveryElement.querySelector('.deliver__courier');
deliveryCourierElement.addEventListener('blur', onDeliveryInputFieldsInput, true);

var submitButtonElement = buyElement.querySelector('.buy__submit-btn');
submitButtonElement.addEventListener('click', onSubmitButtonClick);

var paymentElement = buyElement.querySelector('.payment');
var paymentMethodElement = paymentElement.querySelector('.payment__method');
paymentMethodElement.addEventListener('click', onPaymentTabClick);

var deliveryToggleElement = deliveryElement.querySelector('.deliver__toggle');
deliveryToggleElement.addEventListener('click', onDeliveryTabClick);

// PRICE RANGE FILTER CODE
var onLeftRangeButtonDown = function (evt) {
  var startCoordsX = evt.clientX;
  var dragged = false;
  var onRangeMouseMove = function (moveEvt) {
    dragged = true;
    moveEvt.preventDefault();
    if (moveEvt.clientX >= rangeFilterElement.offsetLeft && moveEvt.clientX <= (rangeFilterElement.offsetLeft + rangeFilterElement.offsetWidth)) {
      var shiftX = startCoordsX - moveEvt.clientX;
      startCoordsX = moveEvt.clientX;
      var leftButtonShift = rangeButtonLeftElement.offsetLeft - shiftX;
      if (leftButtonShift >= 0 && leftButtonShift <= rangeButtonRightElement.offsetLeft) {
        rangeFillLineElement.style.left = leftButtonShift.toString() + 'px';
        rangeButtonLeftElement.style.left = leftButtonShift.toString() + 'px';
        var priceDiff = Math.round((priceRange * rangeFilterWidth / (rangeFilterWidth - rangeButtonLeftElement.offsetWidth)) - priceRange);
        rangePriceMinElement.textContent = (Math.round(((priceRange + priceDiff) * rangeButtonLeftElement.offsetLeft / rangeFilterWidth) + GOOD_MIN_PRICE)).toString();
      }
    }
  };
  var onRangeMouseUp = function (upEvt) {
    upEvt.preventDefault();
    if (!dragged) {
      var priceDiff = Math.round((priceRange * rangeFilterWidth / (rangeFilterWidth - rangeButtonLeftElement.offsetWidth)) - priceRange);
      rangePriceMinElement.textContent = (Math.round(((priceRange + priceDiff) * rangeButtonLeftElement.offsetLeft / rangeFilterWidth) + GOOD_MIN_PRICE)).toString();
    }
    document.removeEventListener('mousemove', onRangeMouseMove);
    document.removeEventListener('mouseup', onRangeMouseUp);
  };
  document.addEventListener('mousemove', onRangeMouseMove);
  document.addEventListener('mouseup', onRangeMouseUp);
};

var onRightRangeButtonDown = function (evt) {
  var startCoordsX = evt.clientX;
  var dragged = false;
  var onRangeMouseMove = function (moveEvt) {
    dragged = true;
    moveEvt.preventDefault();
    if (moveEvt.clientX >= rangeFilterElement.offsetLeft && moveEvt.clientX <= (rangeFilterElement.offsetLeft + rangeFilterElement.offsetWidth)) {
      var shiftX = startCoordsX - moveEvt.clientX;
      startCoordsX = moveEvt.clientX;
      var rightButtonShift = rangeButtonRightElement.offsetLeft - shiftX;
      if (rightButtonShift >= rangeButtonLeftElement.offsetLeft && rightButtonShift <= (rangeFilterWidth - rangeButtonRightElement.offsetWidth)) {
        rangeFillLineElement.style.right = (rangeFilterWidth - rightButtonShift).toString() + 'px';
        rangeButtonRightElement.style.left = rightButtonShift.toString() + 'px';
        var priceDiff = Math.round((priceRange * rangeFilterWidth / (rangeFilterWidth - rangeButtonRightElement.offsetWidth)) - priceRange);
        rangePriceMaxElement.textContent = (Math.round(((priceRange + priceDiff) * rangeButtonRightElement.offsetLeft / rangeFilterWidth) + GOOD_MIN_PRICE)).toString();
      }
    }
  };
  var onRangeMouseUp = function (upEvt) {
    upEvt.preventDefault();
    if (!dragged) {
      var priceDiff = Math.round((priceRange * rangeFilterWidth / (rangeFilterWidth - rangeButtonRightElement.offsetWidth)) - priceRange);
      rangePriceMaxElement.textContent = (Math.round(((priceRange + priceDiff) * rangeButtonRightElement.offsetLeft / rangeFilterWidth) + GOOD_MIN_PRICE)).toString();
    }
    document.removeEventListener('mousemove', onRangeMouseMove);
    document.removeEventListener('mouseup', onRangeMouseUp);
  };
  document.addEventListener('mousemove', onRangeMouseMove);
  document.addEventListener('mouseup', onRangeMouseUp);
};

var rangeFilterElement = document.querySelector('.range');
var rangeFilterWidth = rangeFilterElement.offsetWidth;

var rangePriceMaxElement = rangeFilterElement.querySelector('.range__price--max');
var rangePriceMinElement = rangeFilterElement.querySelector('.range__price--min');

var rangeButtonLeftElement = rangeFilterElement.querySelector('.range__btn--left');
var rangeButtonRightElement = rangeFilterElement.querySelector('.range__btn--right');
var rangeFillLineElement = rangeFilterElement.querySelector('.range__fill-line');
var priceRange = GOOD_MAX_PRICE - GOOD_MIN_PRICE;

// set initial price values from initial conditions
rangeFilterElement.querySelector('.range__price--min').textContent = GOOD_MIN_PRICE;
rangeFilterElement.querySelector('.range__price--max').textContent = GOOD_MAX_PRICE;

rangeButtonLeftElement.addEventListener('mousedown', onLeftRangeButtonDown);
rangeButtonRightElement.addEventListener('mousedown', onRightRangeButtonDown);
