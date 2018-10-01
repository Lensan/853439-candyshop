'use strict';

(function () {
  var PATH_TO_PIC = 'img/cards/';
  var GOOD_IN_STOCK_AMOUNT = 5;
  var GOOD_LITTLE_AMOUNT = 1;
  var GOOD_NONE_AMOUNT = 0;

  var CARD_IN_STOCK_CLASS = 'card--in-stock';
  var CARD_LITTLE_CLASS = 'card--little';
  var CARD_SOON_CLASS = 'card--soon';

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

  var renderCatalogCardsTotal = function (goodData, cardsElement) {
    var catalogCardTemplate = document.querySelector('#card').content.querySelector('.catalog__card');
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < goodData.length; i++) {
      var cardElement = createCatalogCard(catalogCardTemplate, goodData[i]);
      fragment.appendChild(cardElement);
    }
    cardsElement.appendChild(fragment);
  };

  var catalogCardsWrapElement = document.querySelector('.catalog__cards-wrap');
  var catalogCardsElement = catalogCardsWrapElement.querySelector('.catalog__cards');

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
      window.goods.createAndRenderOrderCard(evt);
    }
  };

  var updateGoodData = function (data) {
    data.forEach(function (good) {
      good.picture = PATH_TO_PIC + good.picture;
    });
    return data;
  };

  var onSuccessLoad = function (goodDataLoaded) {
    var goodsData = updateGoodData(goodDataLoaded);
    catalogCardsElement.classList.remove('catalog__cards--load');
    catalogCardsWrapElement.querySelector('.catalog__load').classList.add('visually-hidden');
    renderCatalogCardsTotal(goodsData, catalogCardsElement);
    catalogCardsElement.addEventListener('click', onCatalogCardElementClick);
    window.form.setFormToDefaultValues(true);
    window.catalog.goodsDataTotal = goodsData;
  };

  window.backend.load(onSuccessLoad, window.modal.onErrorLoad);

  window.catalog = {
    goodsDataTotal: [],
    CARD_SOON_CLASS: CARD_SOON_CLASS,
    getParentElement: getParentElement
  };
})();
