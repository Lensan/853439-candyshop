'use strict';

(function () {
  var GOOD_MIN_AMOUNT = 0;
  var GOOD_MAX_AMOUNT = 20;

  var GOOD_MIN_WEIGHT = 30;
  var GOOD_MAX_WEIGHT = 300;

  var GOOD_MIN_RATING_VALUE = 1;
  var GOOD_MAX_RATING_VALUE = 5;

  var GOOD_MIN_RATING_NUMBER = 10;
  var GOOD_MAX_RATING_NUMBER = 900;

  var GOOD_MIN_ENERGY = 70;
  var GOOD_MAX_ENERGY = 500;

  var PATH_TO_PIC = 'img/cards/';
  var NUMBER_OF_REPETITIONS = 100;
  var GOOD_CONTENT_MAX_AMOUNT = 8;

  window.data = {
    GOOD_NAMES: ['Чесночные сливки', 'Огуречный педант', 'Молочная хрюша', 'Грибной шейк', 'Баклажановое безумие', 'Паприколу итальяно', 'Нинзя-удар васаби', 'Хитрый баклажан', 'Горчичный вызов', 'Кедровая липучка', 'Корманный портвейн', 'Чилийский задира', 'Беконовый взрыв', 'Арахис vs виноград', 'Сельдерейная душа', 'Початок в бутылке', 'Чернющий мистер чеснок', 'Раша федераша', 'Кислая мина', 'Кукурузное утро', 'Икорный фуршет', 'Новогоднее настроение', 'С пивком потянет', 'Мисс креветка', 'Бесконечный взрыв', 'Невинные винные', 'Бельгийское пенное', 'Острый язычок'],
    GOOD_PICTURES: ['gum-cedar', 'gum-chile', 'gum-eggplant', 'gum-mustard', 'gum-portwine', 'gum-wasabi', 'ice-cucumber', 'ice-eggplant', 'ice-garlic', 'ice-italian', 'ice-mushroom', 'ice-pig', 'marmalade-beer', 'marmalade-caviar', 'marmalade-corn', 'marmalade-new-year', 'marmalade-sour', 'marshmallow-bacon', 'marshmallow-beer', 'marshmallow-shrimp', 'marshmallow-spicy', 'marshmallow-wine', 'soda-bacon', 'soda-celery', 'soda-cob', 'soda-garlic', 'soda-peanut-grapes', 'soda-russian'],
    GOOD_CONTENTS: ['молоко', 'сливки', 'вода', 'пищевой краситель', 'патока', 'ароматизатор бекона', 'ароматизатор свинца', 'ароматизатор дуба, идентичный натуральному', 'ароматизатор картофеля', 'лимонная кислота', 'загуститель', 'эмульгатор', 'консервант: сорбат калия', 'посолочная смесь: соль, нитрит натрия', 'ксилит', 'карбамид', 'вилларибо', 'виллабаджо'],

    GOOD_IN_STOCK_AMOUNT: 5,
    GOOD_LITTLE_AMOUNT: 1,
    GOOD_NONE_AMOUNT: 0,
    GOODS_AMOUNT_TOTAL: 26,

    CARD_IN_STOCK_CLASS: 'card--in-stock',
    CARD_LITTLE_CLASS: 'card--little',
    CARD_SOON_CLASS: 'card--soon',

    GOOD_MIN_PRICE: 100,
    GOOD_MAX_PRICE: 1500
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

  window.data.generateGoodsData = function (amount, names, pictures, contents) {
    var goods = [];
    amount = Math.min(amount, names.length, pictures.length);
    var indexes = getRandomIndexesArray(amount, Math.min(names.length, pictures.length));
    for (var i = 0; i < amount; i++) {
      var good = {};
      good.name = names[indexes[i]];
      good.picture = PATH_TO_PIC + pictures[indexes[i]] + '.jpg';
      good.amount = getRandomNumber(GOOD_MIN_AMOUNT, GOOD_MAX_AMOUNT);
      good.price = getRandomNumber(window.data.GOOD_MIN_PRICE, window.data.GOOD_MAX_PRICE);
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
})();
