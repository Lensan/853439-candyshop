'use strict';

(function () {
  var catalogSideBarElement = document.querySelector('.catalog__sidebar');
  var catalogFilterInputElements = catalogSideBarElement.querySelectorAll('.input-btn__input');

  var getFilteredData = function (data, param, value, type, name) {
    var dataFiltered = {};
    dataFiltered.name = name;
    dataFiltered.checked = false;
    dataFiltered.type = type;
    dataFiltered.data = data.filter(function (it) {
      var result;
      if (param === 'kind') {
        result = it.kind === value;
      } else if (param === 'sugar') {
        result = it.nutritionFacts.sugar === value;
      } else if (param === 'gluten') {
        result = it.nutritionFacts.gluten === value;
      } else if (param === 'vegetarian') {
        result = it.nutritionFacts.vegetarian === value;
      }
      return result;
    });
    return dataFiltered;
  };

  var getInputButtonItemCountElement = function (element) {
    return element.parentNode.querySelector('.input-btn__item-count');
  };

  var getGoodsAvailableData = function (data) {
    return data.filter(function (good) {
      return good.amount !== 0;
    });
  };

  var setGoodsPriceRangeData = function (data) {
    var prices = data.map(function (good) {
      return good.price;
    });
    var goodMinPrice = Math.min.apply(Math, prices);
    var goodMaxPrice = Math.max.apply(Math, prices);
    var priceRange = goodMaxPrice - goodMinPrice;
    rangePriceMinElement.textContent = goodMinPrice.toString();
    rangePriceMaxElement.textContent = goodMaxPrice.toString();
    rangeFilterElement.querySelector('.range__count').textContent = '(' + data.length + ')';
    window.filter.goodMaxPrice = goodMaxPrice;
    window.filter.goodMinPrice = goodMinPrice;
    window.filter.priceRange = priceRange;
  };

  var setFiltersInitialData = function (goodsData) {
    var goodsFilteredDataTotal = [];
    for (var i = 0; i < catalogFilterInputElements.length; i++) {
      var filterItemName = catalogFilterInputElements[i].name;
      var filterItemValue = catalogFilterInputElements[i].value;
      if (filterItemName === 'food-type' || filterItemName === 'food-property') {
        var goodType = '';
        var goodValue = '';
        if (filterItemName === 'food-type') {
          goodType = 'kind';
          goodValue = catalogFilterInputElements[i].parentNode.querySelector('.input-btn__label').textContent;
        } else {
          goodType = window.goods.getRegexpValue(filterItemValue, '^\\w+');
          goodValue = (filterItemValue === 'vegetarian');
        }
        var dataFiltered = getFilteredData(goodsData, goodType, goodValue, filterItemName, filterItemValue);
        getInputButtonItemCountElement(catalogFilterInputElements[i]).textContent = '(' + dataFiltered.data.length + ')';
        goodsFilteredDataTotal.push(dataFiltered);
      } else if (filterItemName === 'mark') {
        getInputButtonItemCountElement(catalogFilterInputElements[i]).textContent = '(' + ((filterItemValue === 'favorite') ? '0' : getGoodsAvailableData(goodsData).length) + ')';
      }
    }
    setGoodsPriceRangeData(goodsData);
    window.filter.goodsFilteredDataTotal = goodsFilteredDataTotal;
  };

  var changeFilteredDataWithNewPrice = function (goodsCurrentlyFiltered, isPriceChanged) {
    var dataFiltered = [];
    if (!isPriceChanged && !goodsCurrentlyFiltered.length) {
      dataFiltered = goodsCurrentlyFiltered;
    } else {
      goodsCurrentlyFiltered = goodsCurrentlyFiltered.length ? goodsCurrentlyFiltered : window.catalog.goodsDataTotal;
      dataFiltered = goodsCurrentlyFiltered.filter(function (good) {
        return good.price >= rangePriceMinElement.textContent && good.price <= rangePriceMaxElement.textContent;
      });
    }
    return dataFiltered;
  };

  var onLeftRangeButtonMouseDown = function (evt) {
    var priceRange = window.filter.priceRange;
    var goodMinPrice = window.filter.goodMinPrice;
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
          rangePriceMinElement.textContent = (Math.round(((priceRange + priceDiff) * rangeButtonLeftElement.offsetLeft / rangeFilterWidth) + goodMinPrice)).toString();
        }
      }
    };
    var onRangeMouseUp = function (upEvt) {
      upEvt.preventDefault();
      if (!dragged) {
        var priceDiff = Math.round((priceRange * rangeFilterWidth / (rangeFilterWidth - rangeButtonLeftElement.offsetWidth)) - priceRange);
        rangePriceMinElement.textContent = (Math.round(((priceRange + priceDiff) * rangeButtonLeftElement.offsetLeft / rangeFilterWidth) + goodMinPrice)).toString();
      }
      document.removeEventListener('mousemove', onRangeMouseMove);
      document.removeEventListener('mouseup', onRangeMouseUp);
      var currentlyFilteredData = changeFilteredDataWithNewPrice(window.filter.dataFilteredArray, true);
      uncheckFilterMarkInputs();
      var sortItemChecked = window.sort.getSortItemCurrentlyChecked();
      var dataSorted = window.sort.sortCatalogData(currentlyFilteredData, sortItemChecked);
      renderNewCatalogCards(dataSorted);
      window.catalog.goodsDataToSort = currentlyFilteredData;
    };
    document.addEventListener('mousemove', onRangeMouseMove);
    document.addEventListener('mouseup', onRangeMouseUp);
  };

  var onRightRangeButtonMouseDown = function (evt) {
    var priceRange = window.filter.priceRange;
    var goodMinPrice = window.filter.goodMinPrice;
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
          rangePriceMaxElement.textContent = (Math.round(((priceRange + priceDiff) * rangeButtonRightElement.offsetLeft / rangeFilterWidth) + goodMinPrice)).toString();
        }
      }
    };
    var onRangeMouseUp = function (upEvt) {
      upEvt.preventDefault();
      if (!dragged) {
        var priceDiff = Math.round((priceRange * rangeFilterWidth / (rangeFilterWidth - rangeButtonRightElement.offsetWidth)) - priceRange);
        rangePriceMaxElement.textContent = (Math.round(((priceRange + priceDiff) * rangeButtonRightElement.offsetLeft / rangeFilterWidth) + goodMinPrice)).toString();
      }
      document.removeEventListener('mousemove', onRangeMouseMove);
      document.removeEventListener('mouseup', onRangeMouseUp);
      var currentlyFilteredData = changeFilteredDataWithNewPrice(window.filter.dataFilteredArray, true);
      uncheckFilterMarkInputs();
      var sortItemChecked = window.sort.getSortItemCurrentlyChecked();
      var dataSorted = window.sort.sortCatalogData(currentlyFilteredData, sortItemChecked);
      renderNewCatalogCards(dataSorted);
      window.catalog.goodsDataToSort = currentlyFilteredData;
    };
    document.addEventListener('mousemove', onRangeMouseMove);
    document.addEventListener('mouseup', onRangeMouseUp);
  };

  var rangeFilterElement = catalogSideBarElement.querySelector('.range');
  var rangeFilterWidth = rangeFilterElement.offsetWidth;

  var rangePriceMaxElement = rangeFilterElement.querySelector('.range__price--max');
  var rangePriceMinElement = rangeFilterElement.querySelector('.range__price--min');

  var rangeButtonLeftElement = rangeFilterElement.querySelector('.range__btn--left');
  var rangeButtonRightElement = rangeFilterElement.querySelector('.range__btn--right');
  var rangeFillLineElement = rangeFilterElement.querySelector('.range__fill-line');

  rangeButtonLeftElement.addEventListener('mousedown', onLeftRangeButtonMouseDown);
  rangeButtonRightElement.addEventListener('mousedown', onRightRangeButtonMouseDown);

  var getFiltersCheckedItems = function (goodsFilteredData) {
    return goodsFilteredData.filter(function (item) {
      return item.checked === true;
    });
  };

  var checkUncheckGoodInFilterArray = function (goodsFilteredData, goodName, flag) {
    goodsFilteredData.forEach(function (good) {
      if (good.name === goodName) {
        good.checked = flag;
      }
    });
    return goodsFilteredData;
  };

  var filterSingleItem = function (goodsFilteredData, goodName) {
    var dataFiltered = goodsFilteredData.filter(function (goodData) {
      return goodData.name === goodName;
    });
    return dataFiltered[0];
  };

  var filterMultipleItems = function (itemsFilterChecked) {
    var dataTypeFiltered = [];
    itemsFilterChecked.filter(function (item) {
      return item.type === 'food-type';
    }).forEach(function (item) {
      dataTypeFiltered = dataTypeFiltered.concat(item.data);
    });

    var dataFiltered = [];
    for (var i = 0; i < itemsFilterChecked.length; i++) {
      if (!i) {
        dataFiltered = itemsFilterChecked[i].type === 'food-type' ? dataTypeFiltered : itemsFilterChecked[i].data;
      } else if (itemsFilterChecked[i].type !== 'food-type') {
        dataFiltered = dataFiltered.filter(function (data) {
          return itemsFilterChecked[i].data.includes(data);
        });
      }
    }
    return dataFiltered;
  };

  var filterParticularData = function (itemsFilterChecked, goodsFilteredData) {
    var dataFiltered = [];
    if (itemsFilterChecked.length === 1) {
      dataFiltered = filterSingleItem(goodsFilteredData, itemsFilterChecked[0].name);
      dataFiltered = dataFiltered.data;
    } else if (itemsFilterChecked.length) {
      dataFiltered = filterMultipleItems(itemsFilterChecked);
      if (!dataFiltered.length) {
        dataFiltered = [];
      }
    }
    return dataFiltered;
  };

  var renderNewCatalogCards = window.debounce(function (cardsData) {
    var catalogCardsElement = window.catalog.cardsElement;
    window.order.removeAllGoodsCards(catalogCardsElement, '.catalog__card');
    var catalogEmptyFilterElement = catalogCardsElement.querySelector('.catalog__empty-filter');
    if (cardsData.length) {
      if (catalogEmptyFilterElement) {
        catalogEmptyFilterElement.classList.add('visually-hidden');
      }
      window.catalog.renderCatalogCardsTotal(cardsData, catalogCardsElement);
    } else {
      if (catalogEmptyFilterElement) {
        catalogEmptyFilterElement.classList.remove('visually-hidden');
      } else {
        var emptyFiltersTemplate = document.querySelector('#empty-filters').content.querySelector('.catalog__empty-filter');
        var cardElement = emptyFiltersTemplate.cloneNode(true);
        catalogCardsElement.appendChild(cardElement);
      }
    }
  });

  var filterGoodsData = function (filterName, filterChecked) {
    var goodsCurrentlyFiltered = [];
    var goodsFilteredData = window.filter.goodsFilteredDataTotal;
    var itemsFilterChecked = [];
    if (filterChecked) {
      goodsFilteredData = checkUncheckGoodInFilterArray(goodsFilteredData, filterName, true);
      itemsFilterChecked = getFiltersCheckedItems(goodsFilteredData);
      goodsCurrentlyFiltered = filterParticularData(itemsFilterChecked, goodsFilteredData);
    } else {
      goodsFilteredData = checkUncheckGoodInFilterArray(goodsFilteredData, filterName, false);
      itemsFilterChecked = getFiltersCheckedItems(goodsFilteredData);
      if (!itemsFilterChecked.length) {
        goodsCurrentlyFiltered = window.catalog.goodsDataTotal;
      } else {
        goodsCurrentlyFiltered = filterParticularData(itemsFilterChecked, goodsFilteredData);
      }
    }
    window.filter.dataFilteredArray = goodsCurrentlyFiltered;
    window.filter.goodsFilteredDataTotal = goodsFilteredData;
    return goodsCurrentlyFiltered;
  };

  var catalogFilterMarkElements = catalogSideBarElement.querySelector('.catalog__filter:nth-of-type(3)');
  var catalogFilterMarkInputs = catalogFilterMarkElements.querySelectorAll('input');

  var uncheckFilterInputs = function (inputs) {
    if (inputs.length) {
      for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].checked) {
          inputs[i].checked = false;
        }
      }
    } else {
      if (inputs.checked) {
        inputs.checked = false;
      }
    }
  };

  var uncheckFilterMarkInputs = function () {
    uncheckFilterInputs(catalogFilterMarkInputs);
  };

  var filterGoodsCommon = function (inputElement) {
    var goodsFiltered = filterGoodsData(inputElement.value, inputElement.checked);
    goodsFiltered = changeFilteredDataWithNewPrice(goodsFiltered, false);
    uncheckFilterMarkInputs();
    var itemSortChecked = window.sort.getSortItemCurrentlyChecked();
    var dataSorted = window.sort.sortCatalogData(goodsFiltered, itemSortChecked);
    renderNewCatalogCards(dataSorted);
    window.catalog.goodsDataToSort = goodsFiltered;
  };

  var onFilterFoodTypeElementClick = function (evt) {
    if (evt.target.value) {
      filterGoodsCommon(evt.target);
    }
  };

  var onFilterFoodPropertyElementClick = function (evt) {
    if (evt.target.value) {
      filterGoodsCommon(evt.target);
    }
  };

  var revertPriceFilters = function () {
    rangePriceMinElement.textContent = window.filter.goodMinPrice;
    rangePriceMaxElement.textContent = window.filter.goodMaxPrice;
    rangeButtonLeftElement.style.left = '0px';
    rangeFillLineElement.style.left = '0px';
    rangeButtonRightElement.style.left = (rangeFilterWidth - rangeButtonRightElement.offsetWidth).toString() + 'px';
    rangeFillLineElement.style.right = '0px';
  };

  var revertFiltersToDefaultValues = function (inputElement) {
    var goodsFilteredData = window.filter.goodsFilteredDataTotal;
    goodsFilteredData.forEach(function (good) {
      good.checked = false;
    });
    uncheckFilterInputs(foodTypeInputs);
    uncheckFilterInputs(foodPropertyInputs);
    if (!inputElement) {
      uncheckFilterMarkInputs();
    } else {
      if (inputElement.id === 'filter-favorite') {
        uncheckFilterInputs(catalogFilterAvailableElement);
      } else if (inputElement.id === 'filter-availability') {
        uncheckFilterInputs(catalogFilterFavoriteElement);
      }
    }
    revertPriceFilters();
    window.sort.catalogFilterSortElement.querySelector('input:first-of-type').checked = true;
    window.filter.dataFilteredArray = [];
    window.filter.goodsFilteredDataTotal = goodsFilteredData;
  };

  var onFilterSubmitButtonClick = function (evt) {
    evt.preventDefault();
    revertFiltersToDefaultValues(evt.target);
    renderNewCatalogCards(window.catalog.goodsDataTotal);
    window.catalog.goodsDataToSort = window.catalog.goodsDataTotal;
  };

  var onFilterFavoriteElementClick = function (evt) {
    if (evt.target.value) {
      if (evt.target.checked) {
        revertFiltersToDefaultValues(evt.target);
        renderNewCatalogCards(window.catalog.goodsFavoriteData);
      } else {
        renderNewCatalogCards(window.catalog.goodsDataTotal);
      }
      window.catalog.goodsDataToSort = window.catalog.goodsDataTotal;
    }
  };

  var onFilterAvailableElementClick = function (evt) {
    if (evt.target.value) {
      if (evt.target.checked) {
        revertFiltersToDefaultValues(evt.target);
        var goodsAvailableData = getGoodsAvailableData(window.catalog.goodsDataTotal);
        renderNewCatalogCards(goodsAvailableData);
      } else {
        renderNewCatalogCards(window.catalog.goodsDataTotal);
      }
      window.catalog.goodsDataToSort = window.catalog.goodsDataTotal;
    }
  };

  var catalogFilterFoodTypeElement = catalogSideBarElement.querySelector('.catalog__filter:first-of-type');
  var foodTypeInputs = catalogFilterFoodTypeElement.querySelectorAll('input');
  catalogFilterFoodTypeElement.addEventListener('click', onFilterFoodTypeElementClick);

  var catalogFilterFoodPropertyElement = catalogSideBarElement.querySelector('.catalog__filter:nth-of-type(2)');
  var foodPropertyInputs = catalogFilterFoodPropertyElement.querySelectorAll('input');
  catalogFilterFoodPropertyElement.addEventListener('click', onFilterFoodPropertyElementClick);

  var catalogFilterSubmitElement = catalogSideBarElement.querySelector('.catalog__submit');
  catalogFilterSubmitElement.addEventListener('click', onFilterSubmitButtonClick);

  var catalogFilterFavoriteElement = catalogSideBarElement.querySelector('#filter-favorite');
  catalogFilterFavoriteElement.addEventListener('click', onFilterFavoriteElementClick);

  var catalogFilterAvailableElement = catalogSideBarElement.querySelector('#filter-availability');
  catalogFilterAvailableElement.addEventListener('click', onFilterAvailableElementClick);

  window.filter = {
    priceRange: 0,
    goodMinPrice: 0,
    goodMaxPrice: 0,
    goodsFilteredDataTotal: [],
    dataFilteredArray: [],
    catalogFilterFavoriteElement: catalogFilterFavoriteElement,
    renderNewCatalogCards: renderNewCatalogCards,
    setFiltersInitialData: setFiltersInitialData,
    uncheckFilterMarkInputs: uncheckFilterMarkInputs,
    disableAllFilterElements: function () {
      window.order.enableDisableFormInputs(catalogSideBarElement, 'none', true);
      catalogSideBarElement.querySelectorAll('button').forEach(function (button) {
        button.disabled = true;
      });
    },
    getFavoriteButtonCountElement: function () {
      return getInputButtonItemCountElement(catalogFilterFavoriteElement);
    }
  };
})();
