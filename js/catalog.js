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
    classListInitial.forEach(function (item) {
      if (item.includes(oldClass)) {
        if (!isClassFound && item === newClass) {
          isClassFound = true;
        } else {
          classList.remove(item);
        }
      }
    });
    if (!isClassFound) {
      classList.add(newClass);
    }
  };

  var createCatalogCard = function (template, goodData) {
    var card = template.cloneNode(true);
    addRemoveClass(card.classList, card.className, 'card--', getCardClass(goodData.amount));
    card.querySelector('.card__title').textContent = goodData.name;
    var cardImageElement = card.querySelector('.card__img');
    cardImageElement.src = goodData.picture;
    cardImageElement.alt = goodData.name;
    card.querySelector('.card__price').innerHTML = goodData.price + ' <span class="card__currency">₽</span><span class="card__weight">/ ' + goodData.weight + ' Г</span>';
    var starsRatingElement = card.querySelector('.stars__rating');
    addRemoveClass(starsRatingElement.classList, starsRatingElement.className, 'stars__rating--', getStarsRating(goodData.rating.value));
    card.querySelector('.star__count').textContent = '(' + goodData.rating.number + ')';
    card.querySelector('.card__characteristic').textContent = (goodData.nutritionFacts.sugar ? 'Содержит сахар' : 'Без сахара') + '. ' + goodData.nutritionFacts.energy + ' ккал';
    card.querySelector('.card__composition-list').textContent = goodData.nutritionFacts.contents + '.';
    if (goodData.favorite) {
      card.querySelector('.card__btn-favorite').classList.add('card__btn-favorite--selected');
    }
    return card;
  };

  var renderCatalogCardsTotal = function (goodData, cardsElement) {
    var catalogCardTemplate = document.querySelector('#card').content.querySelector('.catalog__card');
    var fragment = document.createDocumentFragment();
    goodData.forEach(function (good) {
      var cardElement = createCatalogCard(catalogCardTemplate, good);
      fragment.appendChild(cardElement);
    });
    cardsElement.appendChild(fragment);
  };

  var catalogCardsWrapElement = document.querySelector('.catalog__cards-wrap');
  var catalogCardsElement = catalogCardsWrapElement.querySelector('.catalog__cards');

  var getParentElement = function (element, className) {
    var isElementFound = false;
    var parentElement = '';
    while (!isElementFound && element.parentNode.nodeName !== '#document') {
      element = element.parentNode;
      if (element.classList.contains(className)) {
        isElementFound = true;
        parentElement = element;
      }
    }
    return parentElement;
  };

  var addRemoveCardComposition = function (cardElement) {
    cardElement.querySelector('.card__composition').classList.toggle('card__composition--hidden');
  };

  var addRemoveCardFavorite = function (favoriteButton, cardElement) {
    favoriteButton.classList.toggle('card__btn-favorite--selected');
    favoriteButton.blur();
    var goodsFavoriteData = window.catalog.goodsFavoriteData;
    var cardData = window.goods.getGoodFromInitialData(cardElement.querySelector('.card__title').textContent, false);
    var cardIndex = goodsFavoriteData.indexOf(cardData);
    if (cardIndex === -1) {
      cardData.favorite = true;
      goodsFavoriteData.push(cardData);
    } else {
      cardData.favorite = false;
      goodsFavoriteData.splice(cardIndex, 1);
      if (window.filter.catalogFilterFavoriteElement.checked) {
        window.filter.renderNewCatalogCards(goodsFavoriteData);
      }
    }
    window.filter.getFavoriteButtonCountElement().textContent = '(' + goodsFavoriteData.length + ')';
    window.catalog.goodsFavoriteData = goodsFavoriteData;
  };

  var onCatalogCardElementClick = function (evt) {
    var targetElement = evt.target;
    var cardElement = getParentElement(targetElement, 'catalog__card');
    if (cardElement) {
      if (targetElement.classList.contains('card__btn-composition')) {
        addRemoveCardComposition(cardElement);
      } else if (targetElement.classList.contains('card__btn-favorite')) {
        evt.preventDefault();
        addRemoveCardFavorite(targetElement, cardElement);
      } else if (targetElement.classList.contains('card__btn')) {
        evt.preventDefault();
        window.goods.createAndRenderOrderCard(cardElement);
      }
    }
  };

  var updateGoodsData = function (goodsData) {
    goodsData.forEach(function (good) {
      good.id = window.goods.getRegexpValue(good.picture, '.+(?=\\.)');
      good.picture = PATH_TO_PIC + good.picture;
      good.favorite = false;
    });
    return goodsData;
  };

  var onSuccessLoad = function (goodsDataLoaded) {
    var goodsData = updateGoodsData(goodsDataLoaded);
    catalogCardsElement.classList.remove('catalog__cards--load');
    catalogCardsWrapElement.querySelector('.catalog__load').classList.add('visually-hidden');
    renderCatalogCardsTotal(goodsData, catalogCardsElement);
    catalogCardsElement.addEventListener('click', onCatalogCardElementClick);
    window.order.setFormToDefaultValues(true);
    window.filter.setFiltersInitialData(goodsData);
    window.catalog.goodsDataTotal = goodsData;
    window.catalog.goodsDataToSort = goodsData;
  };

  window.backend.load(onSuccessLoad, window.modal.onErrorLoad);

  window.catalog = {
    goodsFavoriteData: [],
    goodsDataTotal: [],
    goodsDataToSort: [],
    CARD_SOON_CLASS: CARD_SOON_CLASS,
    cardsElement: catalogCardsElement,
    getParentElement: getParentElement,
    renderCatalogCardsTotal: renderCatalogCardsTotal
  };
})();
