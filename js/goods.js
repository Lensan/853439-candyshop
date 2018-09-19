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
var GOODS_ORDERED_AMOUNT = 3;
var GOOD_ORDER_MIN_AMOUNT = 1;
var GOOD_ORDER_MAX_AMOUNT = 3;
var PATH_TO_PIC = 'img/cards/';
var NUMBER_OF_REPETITIONS = 100;
var GOOD_CONTENT_MAX_AMOUNT = 8;

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
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

var renderCatalogCardsTotal = function (goodAmount, goodNames, goodPictures, goodContents) {
  var catalogCardTemplate = document.querySelector('#card').content.querySelector('.catalog__card');
  var goodData = generateGoodsData(goodAmount, goodNames, goodPictures, goodContents);
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < goodData.length; i++) {
    var cardElement = createCatalogCard(catalogCardTemplate, goodData[i]);
    fragment.appendChild(cardElement);
  }
  var catalogCardsElement = document.querySelector('.catalog__cards-wrap');
  catalogCardsElement.querySelector('.catalog__cards').classList.remove('catalog__cards--load');
  catalogCardsElement.querySelector('.catalog__load').classList.add('visually-hidden');
  catalogCardsElement.querySelector('.catalog__cards').appendChild(fragment);
  return goodData;
};

var goodsDataTotal = renderCatalogCardsTotal(GOODS_AMOUNT_TOTAL, GOOD_NAMES, GOOD_PICTURES, GOOD_CONTENTS);

var getGoodsForOrder = function (goodAmount, goods) {
  var goodsForOrder = [];
  var indexes = getRandomIndexesArray(goodAmount, goods.length);
  for (var i = 0; i < indexes.length; i++) {
    goodsForOrder.push(goods[indexes[i]]);
  }
  return goodsForOrder;
};

var getGoodId = function (path) {
  var id = '';
  var regexp = new RegExp('(?<=\\/.+\\/)(.+)(?=\\.)');
  var ids = path.match(regexp);
  if (ids) {
    id = ids[0];
  }
  return id;
};

var createOrderCard = function (template, good) {
  var card = template.cloneNode(true);
  card.querySelector('.card-order__title').textContent = good.name;
  var cardImageElement = card.querySelector('.card-order__img');
  cardImageElement.src = good.picture;
  cardImageElement.alt = good.name;
  card.querySelector('.card-order__price').textContent = good.price + ' ₽';
  var cardCountElement = card.querySelector('.card-order__count');
  var goodId = getGoodId(good.picture);
  cardCountElement.name = goodId;
  cardCountElement.value = getRandomNumber(GOOD_ORDER_MIN_AMOUNT, GOOD_ORDER_MAX_AMOUNT);
  cardCountElement.id = 'card-order__' + goodId;
  return card;
};

var renderOrderCardsTotal = function (goodAmount, goods) {
  var cardOrderTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');
  var fragment = document.createDocumentFragment();
  var goodsOrdered = getGoodsForOrder(goodAmount, goods);
  for (var i = 0; i < goodsOrdered.length; i++) {
    var cardElement = createOrderCard(cardOrderTemplate, goodsOrdered[i]);
    fragment.appendChild(cardElement);
  }
  var goodCardsElement = document.querySelector('.goods__cards');
  goodCardsElement.classList.remove('goods__cards--empty');
  goodCardsElement.querySelector('.goods__card-empty').classList.add('visually-hidden');
  goodCardsElement.appendChild(fragment);
};

renderOrderCardsTotal(GOODS_ORDERED_AMOUNT, goodsDataTotal);

// FORM VALIDATION AND MANIPULATION FILE
var switchOrderTabs = function (evt, mainTabsClass, tabClass1, tabClass2) {
  var mainTabsElement = document.querySelector(mainTabsClass);
  var regexpTabClass1 = getRegexpValue(tabClass1, '(?<=\\.)\\w+');
  var tabClassToShow = (evt.target.id === regexpTabClass1) ? tabClass1 : tabClass2;
  var tabClassToHide = (evt.target.id === regexpTabClass1) ? tabClass2 : tabClass1;

  var elementToShow = mainTabsElement.querySelector(tabClassToShow);
  elementToShow.classList.remove('visually-hidden');
  var elementToHide = mainTabsElement.querySelector(tabClassToHide);
  elementToHide.classList.add('visually-hidden');

  var inputsToEnable = elementToShow.querySelectorAll('input');
  for (var i = 0; i < inputsToEnable.length; i++) {
    inputsToEnable[i].disabled = false;
  }

  var inputsToDisable = elementToHide.querySelectorAll('input');
  for (var j = 0; j < inputsToDisable.length; j++) {
    inputsToDisable[j].disabled = true;
  }
};

var checkInputElementsTotal = function (evt) {
  var inputElements = evt.currentTarget.querySelectorAll('input[class="text-input__input"]');
  for (var i = 0; i < inputElements.length; i++) {
    checkElementValidity(inputElements[i]);
  }
};

var onUserTabOrSubmitClick = function (evt) {
  if (evt.target.classList.contains('toggle-btn__input')) {
    if (evt.target.name === 'pay-method') {
      switchOrderTabs(evt, '.payment', '.payment__card-wrap', '.payment__cash-wrap');
    } else if (evt.target.name === 'method-deliver') {
      switchOrderTabs(evt, '.deliver', '.deliver__store', '.deliver__courier');
    }
  }
  if (evt.target.classList.contains('buy__submit-btn')) {
    checkInputElementsTotal(evt);
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

var checkElementValidity = function (element) {
  var isCardNumberValid = true;
  if (element.id === 'payment__card-number') {
    isCardNumberValid = checkCardWithLune(element.value);
  }
  if (element.validity.valueMissing) {
    element.setCustomValidity('Поле не должно быть пустым!');
    element.parentNode.classList.add('text-input--error');
  } else if (element.validity.patternMismatch) {
    if (element.id === 'payment__card-number') {
      element.setCustomValidity('Введите номер банковской карты в правильном формате: 16 цифр');
    } else if (element.id === 'payment__card-date') {
      element.setCustomValidity('Введите срок действия карты в правильном формате: мм/гг');
    } else {
      element.setCustomValidity('Неправильный формат данных!');
    }
    element.parentNode.classList.add('text-input--error');
  } else if (element.validity.typeMismatch) {
    element.setCustomValidity('Введите почтовый адрес в правильном формате');
    element.parentNode.classList.add('text-input--error');
  } else if (!isCardNumberValid) {
    element.setCustomValidity('Невалидный номер банковской карты!');
    element.parentNode.classList.add('text-input--error');
  } else {
    element.setCustomValidity('');
    element.parentNode.classList.remove('text-input--error');
  }
  return element.validity.valid;
};

var onUserInputFieldsInput = function (evt) {
  var targetElement = evt.target;
  if (targetElement.type !== 'radio') {
    if (!targetElement.validity.valid) {
      document.querySelector('#buy-form').reportValidity();
    }
    checkElementValidity(targetElement);
  }
};

var onUserInputFieldsStartInput = function (evt) {
  var targetElement = evt.target;
  if (targetElement.type !== 'radio') {
    targetElement.setCustomValidity('');
    targetElement.parentNode.classList.remove('text-input--error');
  }
};

var buyElement = document.querySelector('#buy-form');
buyElement.addEventListener('input', onUserInputFieldsStartInput);
buyElement.addEventListener('blur', onUserInputFieldsInput, true);
buyElement.addEventListener('click', onUserTabOrSubmitClick);
