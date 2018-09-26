'use strict';

(function () {
  var getCardClass = function (goodAmount) {
    var cardClass = '';
    if (goodAmount > window.data.GOOD_IN_STOCK_AMOUNT) {
      cardClass = window.data.CARD_IN_STOCK_CLASS;
    } else if (goodAmount >= window.data.GOOD_LITTLE_AMOUNT && goodAmount <= window.data.GOOD_IN_STOCK_AMOUNT) {
      cardClass = window.data.CARD_LITTLE_CLASS;
    } else if (goodAmount === window.data.GOOD_NONE_AMOUNT) {
      cardClass = window.data.CARD_SOON_CLASS;
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
    var goodData = window.data.generateGoodsData(goodAmount, goodNames, goodPictures, goodContents);
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

  window.catalog = {
    getParentElement: function (evt, className) {
      var element = evt.target;
      var isElementFound = false;
      while (!isElementFound && element.parentNode.nodeName !== '#document') {
        element = element.parentNode;
        if (element.classList.contains(className)) {
          isElementFound = true;
        }
      }
      return element;
    }
  };
  document.addEventListener('DOMContentLoaded', function () {
    catalogCardsElement.classList.remove('catalog__cards--load');
    catalogCardsWrapElement.querySelector('.catalog__load').classList.add('visually-hidden');
    window.catalog.goodsDataTotal = renderCatalogCardsTotal(window.data.GOODS_AMOUNT_TOTAL, window.data.GOOD_NAMES, window.data.GOOD_PICTURES, window.data.GOOD_CONTENTS, catalogCardsElement);
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
    var cardElement = window.catalog.getParentElement(evt, 'catalog__card');
    if (targetElement.classList.contains('card__btn-composition')) {
      addRemoveCardComposition(cardElement);
    } else if (targetElement.classList.contains('card__btn-favorite')) {
      evt.preventDefault();
      addRemoveCardFavorite(evt);
    } else if (targetElement.classList.contains('card__btn')) {
      evt.preventDefault();
      window.goods.createAndRenderOrderCard(evt);
    }
  };
})();
