'use strict';

var GOOD_NAMES = ['Чесночные сливки', 'Огуречный педант', 'Молочная хрюша', 'Грибной шейк', 'Баклажановое безумие', 'Паприколу итальяно', 'Нинзя-удар васаби', 'Хитрый баклажан', 'Горчичный вызов', 'Кедровая липучка', 'Корманный портвейн', 'Чилийский задира', 'Беконовый взрыв', 'Арахис vs виноград', 'Сельдерейная душа', 'Початок в бутылке', 'Чернющий мистер чеснок', 'Раша федераша', 'Кислая мина', 'Кукурузное утро', 'Икорный фуршет', 'Новогоднее настроение', 'С пивком потянет', 'Мисс креветка', 'Бесконечный взрыв', 'Невинные винные', 'Бельгийское пенное', 'Острый язычок'];

var GOOD_PICTURES = ['gum-cedar', 'gum-chile', 'gum-eggplant', 'gum-mustard', 'gum-portwine', 'gum-wasabi', 'ice-cucumber', 'ice-eggplant', 'ice-garlic', 'ice-italian', 'ice-mushroom', 'ice-pig', 'marmalade-beer', 'marmalade-caviar', 'marmalade-corn', 'marmalade-new-year', 'marmalade-sour', 'marshmallow-bacon', 'marshmallow-beer', 'marshmallow-shrimp', 'marshmallow-spicy', 'marshmallow-wine', 'soda-bacon', 'soda-celery', 'soda-cob', 'soda-garlic', 'soda-peanut-grapes', 'soda-russian'];

var GOOD_CONTENTS = ['молоко', 'сливки', 'вода', 'пищевой краситель', 'патока', 'ароматизатор бекона', 'ароматизатор свинца', 'ароматизатор дуба, идентичный натуральному', 'ароматизатор картофеля', 'лимонная кислота', 'загуститель', 'эмульгатор', 'консервант: сорбат калия', 'посолочная смесь: соль, нитрит натрия', 'ксилит', 'карбамид', 'вилларибо', 'виллабаджо'];

var getRandomElement = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
};

var getRandomIndexesArray = function (indexesAmount, arrayLength) {
  var indexesInUse = [];
  var numberOfRepetitions = 30;
  for (var i = 0; i < indexesAmount; i++) {
    var indexRequired = true;
    var j = 0;
    while (indexRequired && j < numberOfRepetitions) {
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
  var contentAmount = getRandomNumber(1, 8);
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

var generateGoodsData = function (names, pictures, contents) {
  var goods = [];
  for (var i = 0; i < names.length; i++) {
    var good = {};
    good.name = getRandomElement(names);
    good.picture = getRandomElement(pictures);
    good.amount = getRandomNumber(0, 20);
    good.price = getRandomNumber(100, 1500);
    good.weight = getRandomNumber(30, 300);
    good.rating = {};
    good.rating.value = getRandomNumber(1, 5);
    good.rating.number = getRandomNumber(10, 900);
    good.nutritionFacts = {};
    good.nutritionFacts.sugar = !!getRandomNumber(0, 1);
    good.nutritionFacts.energy = getRandomNumber(70, 500);
    good.nutritionFacts.contents = generateGoodContent(contents);
    goods.push(good);
  }
  return goods;
};

var renderCardClass = function (amount) {
  var cardClass = '';
  if (amount > 5) {
    cardClass = 'card--in-stock';
  } else if (amount >= 1 && amount <= 5) {
    cardClass = 'card--little';
  } else if (amount === 0) {
    cardClass = 'card--soon';
  }
  return cardClass;
};

var renderStarsRating = function (rating) {
  var starsRatings = ['one', 'two', 'three', 'four', 'five'];
  return 'stars__rating--' + starsRatings[rating - 1];
};

var addReplaceClass = function (element, oldClass, newClass) {
  var classList = element.classList;
  var isClassFound = false;
  var length = classList.length;
  for (var i = 0; i < length; i++) {
    var item = classList.item(i);
    if (item.includes(oldClass)) {
      classList.replace(item, newClass);
      isClassFound = true;
    }
  }
  if (!isClassFound) {
    classList.add(newClass);
  }
};

var generatePicturePath = function (picture) {
  return 'img/cards/' + picture + '.jpg';
};

var createCatalogCard = function (template, product) {
  var card = template.cloneNode(true);
  card.classList.add(renderCardClass(product.amount));
  card.querySelector('.card__title').textContent = product.name;
  var cardImageElement = card.querySelector('.card__img');
  cardImageElement.src = generatePicturePath(product.picture);
  cardImageElement.alt = product.name;
  card.querySelector('.card__price').innerHTML = product.price + ' <span class="card__currency">₽</span><span class="card__weight">/ ' + product.weight + ' Г</span>';
  addReplaceClass(card.querySelector('.stars__rating'), 'stars__rating--', renderStarsRating(product.rating.value));
  card.querySelector('.star__count').textContent = '(' + product.rating.number + ')';
  card.querySelector('.card__characteristic').textContent = (product.nutritionFacts.sugar ? 'Содержит сахар' : 'Без сахара') + '. ' + product.nutritionFacts.energy + ' ккал';
  card.querySelector('.card__composition-list').textContent = product.nutritionFacts.contents + '.';
  return card;
};

var renderCatalogCardsTotal = function (names, pictures, contents) {
  var catalogCardTemplate = document.querySelector('#card').content.querySelector('.catalog__card');
  var goods = generateGoodsData(names, pictures, contents);
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < goods.length; i++) {
    var cardElement = createCatalogCard(catalogCardTemplate, goods[i]);
    fragment.appendChild(cardElement);
  }
  var catalogCardsElement = document.querySelector('.catalog__cards-wrap');
  catalogCardsElement.querySelector('.catalog__cards').classList.remove('catalog__cards--load');
  catalogCardsElement.querySelector('.catalog__load').classList.add('visually-hidden');
  catalogCardsElement.querySelector('.catalog__cards').appendChild(fragment);
  return goods;
};

var goodsDataTotal = renderCatalogCardsTotal(GOOD_NAMES, GOOD_PICTURES, GOOD_CONTENTS);

var getGoodsForOrder = function (amount, goods) {
  var goodsForOrder = [];
  var i = getRandomNumber(1, 10);
  while (goodsForOrder.length < 3 && i < goods.length) {
    if (goods[i].amount !== 0) {
      goodsForOrder.push(goods[i]);
    }
    i += 2;
  }
  return goodsForOrder;
};

var createOrderCard = function (template, product) {
  var card = template.cloneNode(true);
  card.querySelector('.card-order__title').textContent = product.name;
  var cardImageElement = card.querySelector('.card-order__img');
  cardImageElement.src = generatePicturePath(product.picture);
  cardImageElement.alt = product.name;
  card.querySelector('.card-order__price').textContent = product.price + ' ₽';
  var cardCountElement = card.querySelector('.card-order__count');
  cardCountElement.name = product.picture;
  cardCountElement.value = getRandomNumber(1, 3);
  cardCountElement.id = 'card-order__' + product.picture;
  return card;
};

var renderOrderCardsTotal = function (goods) {
  var cardOrderTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');
  var fragment = document.createDocumentFragment();
  var goodsOrdered = getGoodsForOrder(3, goods);
  for (var i = 0; i < goodsOrdered.length; i++) {
    var cardElement = createOrderCard(cardOrderTemplate, goodsOrdered[i]);
    fragment.appendChild(cardElement);
  }
  var goodCardsElement = document.querySelector('.goods__cards');
  goodCardsElement.classList.remove('goods__cards--empty');
  goodCardsElement.querySelector('.goods__card-empty').classList.add('visually-hidden');
  goodCardsElement.appendChild(fragment);
};

renderOrderCardsTotal(goodsDataTotal);
