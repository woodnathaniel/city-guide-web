function appendParentSelector(parentSelector, selector) {
    return parentSelector ? parentSelector + ' ' + selector : selector;

}

/**
 * @description Handles the results tab state.
 * @param {String} resultsElementSelector
 */
function ResultsManager(resultsElementSelector) {
    // console.log(resultsElementSelector);
    this.resultsElement = document.querySelector(appendParentSelector(resultsElementSelector, '.js-results'));
    console.log(this.resultsElement);
    this.jsTabs = document.querySelector(appendParentSelector(resultsElementSelector, '.js-tabs'));
    console.log(this.jsTabs);
    this.resultsPlaceholder = document.querySelector(appendParentSelector(resultsElementSelector, '.js-results-placeholder'));
    this.resultsLoader = document.querySelector(appendParentSelector(resultsElementSelector, '.js-results-loader'));
}

ResultsManager.prototype.loading = function() {
    this.resultsLoader.removeAttribute('hidden');
    this.resultsElement.setAttribute('hidden', 'hidden');
    this.resultsPlaceholder.setAttribute('hidden', 'hidden');
    this.resultsElement.innerHTML = '';
};

ResultsManager.prototype.success = function() {
    let blurElement = document.querySelector('#map');
    blurElement.classList.toggle('activeBlur');
    // blurElement.classList.toggle(activeBlur)
    let routePop = document.querySelector('#hide');
    routePop.classList.toggle('active');
    this.resultsLoader.setAttribute('hidden', 'hidden');
    this.resultsElement.removeAttribute('hidden');
    this.jsTabs.removeAttribute('hidden');
   
    // this.resultsElement.style.overflow = 'hidden';
    // this.resultsElement.style.overflowY = 'scroll';
};

ResultsManager.prototype.resultsNotFound = function() {
    this.resultsElement.setAttribute('hidden', 'hidden');
    this.resultsLoader.setAttribute('hidden', 'hidden');
    this.resultsPlaceholder.removeAttribute('hidden');
};

ResultsManager.prototype.append = function(element) {
    this.resultsElement.appendChild(element);
};

ResultsManager.prototype.clear = function() {
    for (let i = 0; i < this.resultsElement.children.length; i++) {
        this.resultsElement.removeChild(this.resultsElement.children[i]);
    }

    // if(this.resultsElement.innerText == ''){
    //   this.jsTabs.setAttribute('hidden', 'hidden')
    // }
    
};

window.ResultsManager = window.ResultsManager || ResultsManager;
