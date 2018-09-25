'use strict';

(function () {
  var onLeftRangeButtonDown = function (evt) {
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
          rangePriceMinElement.textContent = (Math.round(((priceRange + priceDiff) * rangeButtonLeftElement.offsetLeft / rangeFilterWidth) + window.data.GOOD_MIN_PRICE)).toString();
        }
      }
    };
    var onRangeMouseUp = function (upEvt) {
      upEvt.preventDefault();
      if (!dragged) {
        var priceDiff = Math.round((priceRange * rangeFilterWidth / (rangeFilterWidth - rangeButtonLeftElement.offsetWidth)) - priceRange);
        rangePriceMinElement.textContent = (Math.round(((priceRange + priceDiff) * rangeButtonLeftElement.offsetLeft / rangeFilterWidth) + window.data.GOOD_MIN_PRICE)).toString();
      }
      document.removeEventListener('mousemove', onRangeMouseMove);
      document.removeEventListener('mouseup', onRangeMouseUp);
    };
    document.addEventListener('mousemove', onRangeMouseMove);
    document.addEventListener('mouseup', onRangeMouseUp);
  };

  var onRightRangeButtonDown = function (evt) {
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
          rangePriceMaxElement.textContent = (Math.round(((priceRange + priceDiff) * rangeButtonRightElement.offsetLeft / rangeFilterWidth) + window.data.GOOD_MIN_PRICE)).toString();
        }
      }
    };
    var onRangeMouseUp = function (upEvt) {
      upEvt.preventDefault();
      if (!dragged) {
        var priceDiff = Math.round((priceRange * rangeFilterWidth / (rangeFilterWidth - rangeButtonRightElement.offsetWidth)) - priceRange);
        rangePriceMaxElement.textContent = (Math.round(((priceRange + priceDiff) * rangeButtonRightElement.offsetLeft / rangeFilterWidth) + window.data.GOOD_MIN_PRICE)).toString();
      }
      document.removeEventListener('mousemove', onRangeMouseMove);
      document.removeEventListener('mouseup', onRangeMouseUp);
    };
    document.addEventListener('mousemove', onRangeMouseMove);
    document.addEventListener('mouseup', onRangeMouseUp);
  };

  var rangeFilterElement = document.querySelector('.range');
  var rangeFilterWidth = rangeFilterElement.offsetWidth;

  var rangePriceMaxElement = rangeFilterElement.querySelector('.range__price--max');
  var rangePriceMinElement = rangeFilterElement.querySelector('.range__price--min');

  var rangeButtonLeftElement = rangeFilterElement.querySelector('.range__btn--left');
  var rangeButtonRightElement = rangeFilterElement.querySelector('.range__btn--right');
  var rangeFillLineElement = rangeFilterElement.querySelector('.range__fill-line');
  var priceRange = window.data.GOOD_MAX_PRICE - window.data.GOOD_MIN_PRICE;

  // set initial price values from initial conditions
  rangeFilterElement.querySelector('.range__price--min').textContent = window.data.GOOD_MIN_PRICE;
  rangeFilterElement.querySelector('.range__price--max').textContent = window.data.GOOD_MAX_PRICE;

  rangeButtonLeftElement.addEventListener('mousedown', onLeftRangeButtonDown);
  rangeButtonRightElement.addEventListener('mousedown', onRightRangeButtonDown);
})();
