'use strict';

var GOOD_NAMES = ['Чесночные сливки', 'Огуречный педант', 'Молочная хрюша', 'Грибной шейк', 'Баклажановое безумие', 'Паприколу итальяно', 'Нинзя-удар васаби', 'Хитрый баклажан', 'Горчичный вызов', 'Кедровая липучка', 'Корманный портвейн', 'Чилийский задира', 'Беконовый взрыв', 'Арахис vs виноград', 'Сельдерейная душа', 'Початок в бутылке', 'Чернющий мистер чеснок', 'Раша федераша', 'Кислая мина', 'Кукурузное утро', 'Икорный фуршет', 'Новогоднее настроение', 'С пивком потянет', 'Мисс креветка', 'Бесконечный взрыв', 'Невинные винные', 'Бельгийское пенное', 'Острый язычок'];

var GOOD_PICTURES = ['gum-cedar.jpg', 'gum-chile.jpg', 'gum-eggplant.jpg', 'gum-mustard.jpg', 'gum-portwine.jpg', 'gum-wasabi.jpg', 'ice-cucumber.jpg', 'ice-eggplant.jpg', 'ice-garlic.jpg', 'ice-italian.jpg', 'ice-mushroom.jpg', 'ice-pig.jpg', 'marmalade-beer.jpg', 'marmalade-caviar.jpg', 'marmalade-corn.jpg', 'marmalade-new-year.jpg', 'marmalade-sour.jpg', 'marshmallow-bacon.jpg', 'marshmallow-beer.jpg', 'marshmallow-shrimp.jpg', 'marshmallow-spicy.jpg', 'marshmallow-wine.jpg', 'soda-bacon.jpg', 'soda-celery.jpg', 'soda-cob.jpg', 'soda-garlic.jpg', 'soda-peanut-grapes.jpg', 'soda-russian.jpg'];

var GOOD_CONTENTS = ['молоко', 'сливки', 'вода', 'пищевой краситель', 'патока', 'ароматизатор бекона', 'ароматизатор свинца', 'ароматизатор дуба, идентичный натуральному', 'ароматизатор картофеля', 'лимонная кислота', 'загуститель', 'эмульгатор', 'консервант: сорбат калия', 'посолочная смесь: соль, нитрит натрия', 'ксилит', 'карбамид', 'вилларибо', 'виллабаджо'];

var getRandomElement = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
};

var generateContent = function (contents) {
  var contentAmount = getRandomNumber(1, contents.length);
  var content = '';
  var usedIndexes = [];

  for (var i = 0; i < contentAmount; i++) {
    var contentIndex = getRandomNumber(0, contents.length - 1);
    var useAnotherIndex = false;
    var j = 0;
    while (!useAnotherIndex && j < usedIndexes.length) {
      if (contentIndex === usedIndexes[j]) {
        useAnotherIndex = true;
      }
      j++;
    }
    if (!useAnotherIndex) {
      usedIndexes.push(contentIndex);
      content += contents[contentIndex];
      if (i !== contentAmount - 1) {
        content += ', ';
      }
    } else {
      i--;
    }
  }
  return content;
};

var generateGoodsData = function (names, pictures, contents) {
  var goods = [];
  for (var i = 0; i < names.length; i++) {
    var good = {};
    good.name = getRandomElement(names);
    good.picture = '/img/cards/' + getRandomElement(pictures);
    good.amount = getRandomNumber(0, 20);
    good.price = getRandomNumber(100, 1500);
    good.weight = getRandomNumber(30, 300);
    good.rating = {};
    good.rating.value = getRandomNumber(1, 5);
    good.rating.number = getRandomNumber(10, 900);
    good.nutritionFacts = {};
    good.nutritionFacts.sugar = !!getRandomNumber(0, 1);
    good.nutritionFacts.energy = getRandomNumber(70, 500);
    good.nutritionFacts.contents = generateContent(contents);
    goods.push(good);
  }
  return goods;
};

var candies = generateGoodsData(GOOD_NAMES, GOOD_PICTURES, GOOD_CONTENTS);
console.log(candies);
console.log('Goods amount: ' + GOOD_NAMES.length);
