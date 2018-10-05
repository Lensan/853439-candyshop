'use strict';

(function () {

  var sortCatalogData = function (data, sortItem) {
    var dataSorted = [];
    if (sortItem === 'popular') {
      dataSorted = data;
    } else if (sortItem === 'expensive') {
      dataSorted = data.slice(0).sort(function (first, second) {
        return second.price - first.price;
      });
    } else if (sortItem === 'cheep') {
      dataSorted = data.slice(0).sort(function (first, second) {
        return first.price - second.price;
      });
    } else if (sortItem === 'rating') {
      dataSorted = data.slice(0).sort(function (first, second) {
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

  var onCatalogFilterSortElementClick = function (evt) {
    var catalogCardsSorted = sortCatalogData(window.window.catalog.goodsDataToSort, evt.target.value);
    window.filter.uncheckFilterInputs(window.filter.catalogFilterMarkInputs);
    window.filter.renderNewCatalogCards(catalogCardsSorted);
  };

  var catalogFilterSortElement = window.filter.catalogSideBarElement.querySelector('ul.catalog__filter:last-of-type');
  catalogFilterSortElement.addEventListener('click', onCatalogFilterSortElementClick);

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
