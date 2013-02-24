/**
 * @fileoverview A controller to manage showing different page modules under a tabbed container
 */

/**
 * @constructor
 */
scaligent.demo.PageController = function() {
    /**
     * Reference to the tabs object after init
     * @type {Object}
     */
    this.tabs_;

    /**
     * @type {Object.<scaligent.demo.PageController.PageType, number>}
     * @private
     */
    this.tabIndices_ = {};
};
scaligent.demo.Util.addSingletonGetter(scaligent.demo.PageController);

/**
 * @enum {string}
 */
scaligent.demo.PageController.PageType = {
    FILE_UPLOAD: 'file-upload',
    DATA_TABLE: 'data-table',
    LINE_CHART: 'line-chart',
    SCATTER_CHART: 'scatter-chart'
};

/**
 * @param {Element} tabContainerEl
 * @return {scaligent.demo.PageController} this for chaining
 */
scaligent.demo.PageController.prototype.init = function(tabContainerEl) {
    this.tabs_ = $(tabContainerEl).tabs();
    return this;
};

/**
 * @param {scaligent.demo.PageController.PageType} pageType
 * @param {number} tabIndex
 * @return {scaligent.demo.PageController} this for chaining
 */
scaligent.demo.PageController.prototype.setTabIndex = function(pageType, tabIndex) {
    this.tabIndices_[pageType] = tabIndex;
    return this;
};

/**
 * @param {scaligent.demo.PageController.PageType} pageType
 * @return {scaligent.demo.PageController} this for chaining
 */
scaligent.demo.PageController.prototype.showPage = function(pageType) {
    var tabIndex = this.tabIndices_[pageType];
    this.tabs_.tabs('select', tabIndex);
    return this;
};

/**
 * @param {scaligent.demo.PageController.PageType} pageType
 * @param {boolean} enable
 * @return {scaligent.demo.PageController} this for chaining
 */
scaligent.demo.PageController.prototype.enablePage = function(pageType, enable) {
    var tabIndex = this.tabIndices_[pageType];
    this.tabs_.tabs(enable? 'enable': 'disable', tabIndex);
    return this;
};

/**
 * @param {boolean} enable
 * @return {scaligent.demo.PageController} this for chaining
 */
scaligent.demo.PageController.prototype.enableAllPages = function(enable) {
    this.enablePage(undefined, enable);
    return this;
};