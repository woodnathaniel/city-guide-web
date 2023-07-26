function appendParentSelector(parentSelector, selector) {
  return parentSelector ? parentSelector + ' ' + selector : selector;
}

/**
* @description Handles the results tab state.
* @param {String} resultsElementSelector
*/
function ResultsManagerSearch(resultsElementSelector) {
  this.resultsElement = document.querySelector(appendParentSelector(resultsElementSelector, '.js-results-search'));
  this.resultsPlaceholder =
      document.querySelector(appendParentSelector(resultsElementSelector, '.js-results-placeholder-search'));
  this.resultsLoader = document.querySelector(appendParentSelector(resultsElementSelector, '.js-results-loader-search'));
}

ResultsManagerSearch.prototype.loading = function() {
  this.resultsLoader.removeAttribute('hidden');
  this.resultsElement.setAttribute('hidden', 'hidden');
  this.resultsPlaceholder.setAttribute('hidden', 'hidden');
  this.resultsElement.innerHTML = '';
};

ResultsManagerSearch.prototype.success = function() {
  this.resultsLoader.setAttribute('hidden', 'hidden');
  this.resultsElement.removeAttribute('hidden');
};

ResultsManagerSearch.prototype.resultsNotFound = function() {
  this.resultsElement.setAttribute('hidden', 'hidden');
  this.resultsLoader.setAttribute('hidden', 'hidden');
  this.resultsPlaceholder.removeAttribute('hidden');
};

ResultsManagerSearch.prototype.append = function(element) {
  this.resultsElement.appendChild(element);
};

ResultsManagerSearch.prototype.clear = function() {
  for (var i = 0; i < this.resultsElement.children.length; i++) {
      this.resultsElement.removeChild(this.resultsElement.children[i]);
  }
};

window.ResultsManagerSearch = window.ResultsManagerSearch || ResultsManagerSearch;
