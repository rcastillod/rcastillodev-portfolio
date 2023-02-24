import imagesLoaded from 'imagesloaded'

/**
 * Preload images
 * @param {String} selector - Selector/scope from where images need to be preloaded. Default is 'img'
 */
const preloadImages = (selector = 'img') => {
  return new Promise((resolve) => {
    imagesLoaded(document.querySelectorAll(selector), { background: true }, resolve);
  });
};

/**
 * Wraps the elements of an array.
 * @param {Array} arr - the array of elements to be wrapped
 * @param {String} wrapType - the type of the wrap element ('div', 'span' etc)
 * @param {String} wrapClass - the wrap class(es)
 */
const wrapLines = (arr, wrapType, wrapClass) => {
  arr.forEach(el => {
    const wrapEl = document.createElement(wrapType);
    wrapEl.classList = wrapClass;
    el.parentNode.appendChild(wrapEl);
    wrapEl.appendChild(el);
  });
}

/**
 * Checks if an element is in the viewport
 * @param {Element} elem - the element to be checked
 */
const isInViewport = elem => {
  var bounding = elem.getBoundingClientRect();
  return (
    (bounding.bottom >= 0 && bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) || bounding.top >= 0 && bounding.top <= (window.innerHeight || document.documentElement.clientHeight)) &&
    (bounding.right >= 0 && bounding.right <= (window.innerWidth || document.documentElement.clientWidth) || bounding.left >= 0 && bounding.left <= (window.innerWidth || document.documentElement.clientWidth))
  );
};

// Detect Closest Edge
// from https://codepen.io/johnstew/pen/zxYJZP?editors=0010
const closestEdge = (x, y, w, h) => {
  const topEdgeDist = distMetric(x, y, w / 2, 0);
  const bottomEdgeDist = distMetric(x, y, w / 2, h);
  const min = Math.min(topEdgeDist, bottomEdgeDist);
  return min === topEdgeDist ? 'top' : 'bottom';
}

// Distance Formula
// from https://codepen.io/johnstew/pen/zxYJZP?editors=0010
const distMetric = (x, y, x2, y2) => {
  const xDiff = x - x2;
  const yDiff = y - y2;
  return (xDiff * xDiff) + (yDiff * yDiff);
}

export {
  preloadImages,
  wrapLines,
  isInViewport,
  closestEdge,
  distMetric
};