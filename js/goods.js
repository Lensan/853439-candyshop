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
  var i = 0;
  while (!element.classList.contains(className) && i < NUMBER_OF_REPETITIONS) {
    element = element.parentNode;
    i++;
  }
  return element;
};

var getRegexpValue = function (path, expression) {
  var value = '';
  var regexp = new RegExp(expression);
  var result = path.match(regexp);
  if (result) {
    value = result[0];
  }
  return value;
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
  renderCatalogCardsTotal(GOODS_AMOUNT_TOTAL, GOOD_NAMES, GOOD_PICTURES, GOOD_CONTENTS, catalogCardsElement);

  var favoriteButtons = document.querySelectorAll('.card__btn-favorite');
  addButtonsListener(favoriteButtons, onFavoriteButtonClickOrPress);

  var buyButtons = document.querySelectorAll('.card__btn');
  addButtonsListener(buyButtons, onBuyButtonClickOrPress);
});

var addButtonsListener = function (buttons, action) {
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', action);
    buttons[i].addEventListener('keydown', action);
  }
};

var removeFocus = function (evt) {
  evt.target.blur();
};

var onFavoriteButtonClickOrPress = function (evt) {
  if (evt.type === 'click' || (evt.type === 'keydown' && evt.key === ENTER_KEY)) {
    evt.preventDefault();
    evt.target.classList.toggle('card__btn-favorite--selected');
    if (evt.type !== 'keydown') {
      evt.target.onmouseup = removeFocus;
    }
  }
};

var onBuyButtonClickOrPress = function (evt) {
  if (evt.type === 'click' || (evt.type === 'keydown' && evt.key === ENTER_KEY)) {
    evt.preventDefault();
    createAndRenderOrderCard(evt);
  }
};

var getCardDataForOrder = function (evt) {
  var cardElement = getParentElement(evt, 'catalog__card');
  var cardData = {};
  if (!cardElement.classList.contains(CARD_SOON_CLASS)) {
    cardData.name = cardElement.querySelector('.card__title').textContent;
    cardData.picture = cardElement.querySelector('.card__img').src;
    cardData.price = getRegexpValue(cardElement.querySelector('.card__price').textContent, '.+(?=\\/)');
  } else {
    cardData = '';
  }
  return cardData;
};

var addSingleButtonListener = function (button, action, mouseEvent, keyboardEvent) {
  button.addEventListener(mouseEvent, action);
  button.addEventListener(keyboardEvent, action);
};

var checkGoodIsOrdered = function (goodData) {
  var isGoodOrdered = false;
  var goodsOrderedTotal = document.querySelectorAll('.card-order');
  for (var i = 0; i < goodsOrderedTotal.length; i++) {
    var goodTitle = goodsOrderedTotal[i].querySelector('.card-order__title').textContent;
    if (goodTitle === goodData.name) {
      goodsOrderedTotal[i].querySelector('.card-order__count').value++;
      isGoodOrdered = true;
    }
  }
  return isGoodOrdered;
};

var createAndRenderOrderCard = function (evt) {
  var goodOrderedData = getCardDataForOrder(evt);

  if (goodOrderedData !== '') {
    var isGoodInList = checkGoodIsOrdered(goodOrderedData);
    if (!isGoodInList) {
      var orderCardElement = renderOrderCard(goodOrderedData);

      var orderCloseButton = orderCardElement.querySelector('.card-order__close');
      addSingleButtonListener(orderCloseButton, onOrderCloseButtonClickOrPress, 'click', 'keydown');

      var orderDecreaseButton = orderCardElement.querySelector('.card-order__btn--decrease');
      addSingleButtonListener(orderDecreaseButton, onOrderCountButtonsClickOrPress, 'click', 'keydown');

      var orderIncreaseButton = orderCardElement.querySelector('.card-order__btn--increase');
      addSingleButtonListener(orderIncreaseButton, onOrderCountButtonsClickOrPress, 'click', 'keydown');

      var orderCountButton = orderCardElement.querySelector('.card-order__count');
      addSingleButtonListener(orderCountButton, onOrderCountButtonsClickOrPress, 'click', 'keyup');
    }
  }
};

var removeGoodFromOrder = function (evt) {
  var cardOrderElement = getParentElement(evt, 'card-order');
  cardOrderElement.parentNode.removeChild(cardOrderElement);
  changeGoodCardsElement(document.querySelector('.goods__cards'));
};

var increaseDecreaseCheckOrderAmount = function (evt) {
  var cardOrderAmountElement = getParentElement(evt, 'card-order__amount');
  var cardOrderCountElement = cardOrderAmountElement.querySelector('.card-order__count');
  if (evt.target.classList.contains('card-order__btn--increase')) {
    cardOrderCountElement.value++;
  } else {
    if (evt.target.classList.contains('card-order__btn--decrease')) {
      cardOrderCountElement.value--;
    }
    if (parseInt(cardOrderCountElement.value, 10) <= 0 || !parseInt(cardOrderCountElement.value, 10)) {
      removeGoodFromOrder(evt);
    }
  }
};

var onOrderCloseButtonClickOrPress = function (evt) {
  if (evt.type === 'click' || (evt.type === 'keydown' && evt.key === ENTER_KEY)) {
    evt.preventDefault();
    removeGoodFromOrder(evt);
  }
};

var onOrderCountButtonsClickOrPress = function (evt) {
  if (evt.type === 'click' || evt.type === 'keyup' || (evt.type === 'keydown' && evt.key === ENTER_KEY)) {
    evt.preventDefault();
    increaseDecreaseCheckOrderAmount(evt);
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

var checkGoodCardsEmpty = function (element) {
  return (!element.querySelector('.card-order'));
};

var changeGoodCardsElement = function (element) {
  if (checkGoodCardsEmpty(element)) {
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

var onUserInputFieldsInput = function (evt) {
  var targetElement = evt.target;
  if (targetElement.validity.valueMissing) {
    targetElement.setCustomValidity('Поле не должно быть пустым!');
    targetElement.parentNode.classList.add('text-input--error');
  } else if (targetElement.validity.patternMismatch) {
    if (targetElement.id === 'payment__card-number') {
      targetElement.setCustomValidity('Введите номер банковской карты в правильном формате: 16 цифр');
    } else if (targetElement.id === 'payment__card-date') {
      targetElement.setCustomValidity('Введите срок действия карты в правильном формате: мм/гг');
    } else {
      targetElement.setCustomValidity('Неправильный формат данных!');
    }
    targetElement.parentNode.classList.add('text-input--error');
  } else if (targetElement.validity.typeMismatch) {
    targetElement.setCustomValidity('Введите почтовый адрес в правильном формате');
    targetElement.parentNode.classList.add('text-input--error');
  } else {
    targetElement.setCustomValidity('');
    targetElement.parentNode.classList.remove('text-input--error');
  }
};

var onUserInputFieldsStartInput = function (evt) {
  var targetElement = evt.target;
  targetElement.setCustomValidity('');
  targetElement.parentNode.classList.remove('text-input--error');
};

var buyElement = document.querySelector('.buy');
buyElement.addEventListener('input', onUserInputFieldsStartInput);
buyElement.addEventListener('change', onUserInputFieldsInput);
buyElement.addEventListener('invalid', onUserInputFieldsInput, true);
