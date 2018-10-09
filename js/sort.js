'use strict';

(function () {
  var sortCatalogData = function (data, sortItem) {
    var dataSorted = [];
    if (sortItem === 'popular') {
      dataSorted = data;
    } else if (sortItem === 'expensive') {
      dataSorted = data.slice().sort(function (first, second) {
        return second.price - first.price;
      });
    } else if (sortItem === 'cheep') {
      dataSorted = data.slice().sort(function (first, second) {
        return first.price - second.price;
      });
    } else if (sortItem === 'rating') {
      dataSorted = data.slice().sort(function (first, second) {
        if (second.rating.value > first.rating.value) {
          return 1;
        } else if (second.rating.value < first.rating.value) {
          return -1;
        } else {
          return second.rating.number - first.rating.number;
        }
      });
    }
    return dataSorted;
  };

  var onFilterSortElementClick = function (evt) {
    if (evt.target.value) {
      var catalogCardsSorted = sortCatalogData(window.window.catalog.goodsDataToSort, evt.target.value);
      window.filter.uncheckFilterMarkInputs();
      window.filter.renderNewCatalogCards(catalogCardsSorted);
    }
  };

  var catalogFilterSortElement = document.querySelector('.catalog__sidebar').querySelector('ul.catalog__filter:last-of-type');
  catalogFilterSortElement.addEventListener('click', onFilterSortElementClick);

  window.sort = {
    catalogFilterSortElement: catalogFilterSortElement,
    sortCatalogData: sortCatalogData,
    getSortItemCurrentlyChecked: function () {
      var catalogFilterSortInputs = catalogFilterSortElement.querySelectorAll('input');
      var checkedItem = '';
      for (var i = 0; i < catalogFilterSortInputs.length; i++) {
        if (catalogFilterSortInputs[i].checked) {
          checkedItem = catalogFilterSortInputs[i].value;
        }
      }
      return checkedItem;
    }
  };
})();
