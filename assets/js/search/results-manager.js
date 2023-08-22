function appendParentSelector(parentSelector, selector) {
    return parentSelector ? parentSelector + ' ' + selector : selector;

}

/**
 * @description Handles the results tab state.
 * @param {String} resultsElementSelector
 */
function ResultsManager(resultsElementSelector) {
    // console.log(resultsElementSelector);
    this.resultsElement = document.querySelectorAll(appendParentSelector(resultsElementSelector, '.js-results'));
    console.log(this.resultsElement);
    this.jsTabs = document.querySelectorAll(appendParentSelector(resultsElementSelector, '.js-tabs'));
    console.log(this.jsTabs);
    this.resultsPlaceholder = document.querySelectorAll(appendParentSelector(resultsElementSelector, '.js-results-placeholder'));
    this.resultsLoader = document.querySelectorAll(appendParentSelector(resultsElementSelector, '.js-results-loader'));
}

ResultsManager.prototype.loading = function() {
    this.resultsLoader.forEach((element)=>{
        element.removeAttribute('hidden');
    })


    this.resultsElement.forEach((element)=>{
        element.setAttribute('hidden', 'hidden');
    })

    this.resultsPlaceholder.forEach((element)=>{
        element.setAttribute('hidden', 'hidden');  
    })

    this.resultsElement.forEach((element)=>{
        element.innerHTML = '';
    })
};

ResultsManager.prototype.success = function() {
    let blurElement = document.querySelector('#map');
    blurElement.classList.toggle('activeBlur');
    // blurElement.classList.toggle(activeBlur)
    let routePop = document.querySelector('#hide');
    routePop.classList.toggle('active');

    console.log(this.resultsElement);
    console.log(typeof(this.resultsElement));

    this.resultsLoader.forEach((element)=>{
        element.setAttribute('hidden', 'hidden'); 
    })

    this.resultsElement.forEach((element)=>{
        element.removeAttribute('hidden');
    })

    this.jsTabs.forEach((element)=>{
        element.removeAttribute('hidden');
    })
   
    // this.resultsElement.style.overflow = 'hidden';
    // this.resultsElement.style.overflowY = 'scroll';

                document.querySelector('.menu').classList.toggle('active-menu');
                document.querySelector('.menu-panel').classList.toggle('active-menu-panel')
};

ResultsManager.prototype.resultsNotFound = function() {
    this.resultsElement.forEach((element)=>{
        element.setAttribute('hidden', 'hidden');
    })

    this.resultsLoader.forEach((element)=>{
        element.setAttribute('hidden', 'hidden');
    })

    this.resultsPlaceholder.forEach((element)=>{
        element.removeAttribute('hidden');
    })
};

ResultsManager.prototype.append = function(element) {
    console.log(element)
    console.log(typeof(element))
    this.resultsElement.forEach((el) =>{
        el.appendChild(element);
    }) 
};

ResultsManager.prototype.clear = function() {
    this.resultsElement.forEach((element) => {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    });
    
    // if(this.resultsElement.innerText == ''){
    //   this.jsTabs.setAttribute('hidden', 'hidden')
    // }
};

window.ResultsManager = window.ResultsManager || ResultsManager;
