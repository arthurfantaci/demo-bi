/**
 * @fileoverview Code to handle reading data from file or textarea
 */

/**
 * @constructor
 */
scaligent.demo.InputHandler = function() {
    /**
     * @type {Element}
     * @private
     */
    this.fileInputEl_;

    /**
     * @type {Element}
     * @private
     */
    this.textInputEl_;

    /**
     * @type {Element}
     * @private
     */
    this.textInputFormEl_;
};
scaligent.demo.Util.addSingletonGetter(scaligent.demo.InputHandler);

/**
 * @param {Element} fileInputEl the file input form field
 * @param {Element} textInputEl text area input if file reading is not possible
 * @param {Element} textInputSectionEl text area input section including submit button
 */
scaligent.demo.InputHandler.prototype.init = function(fileInputEl, textInputEl, textInputFormEl) {
    this.fileInputEl_ = fileInputEl;
    this.textInputEl_ = textInputEl;
    this.textInputFormEl_ = textInputFormEl;

    if (window.File && window.FileReader) {
        this.listenFileInputChange_();
    } else {
        $(this.fileInputEl_).hide();
        $(this.textInputFormEl_).show();
        this.listenTextInputSubmit_();
    }
};

/**
 * @private
 */
scaligent.demo.InputHandler.prototype.listenFileInputChange_ = function() {
    $(this.fileInputEl_).change($.proxy(function(e) {
        this.readFile_(e.target.files[0]);
    }, this));
};

/**
 * @private
 */
scaligent.demo.InputHandler.prototype.listenTextInputSubmit_ = function() {
    $(this.textInputFormEl_).submit($.proxy(function(e) {
        e.preventDefault();
        this.handleCSV_(this.textInputEl_.value);
    }, this));
};

/**
 * @param e
 * @private
 */
scaligent.demo.InputHandler.prototype.handleSelectedFile_ = function(e) {
    this.readFile_(e.target.files[0]);
};

/**
 * @param {File} file
 * @private
 */
scaligent.demo.InputHandler.prototype.readFile_ = function(file) {
    var reader = new FileReader();
    reader.onload = $.proxy(function(e) {
        this.handleCSV_(e.target.result);
    }, this);
    reader.readAsText(file);

    // we can show a loading page here
};

/**
 * @param {string} csv
 * @private
 */
scaligent.demo.InputHandler.prototype.handleCSV_ = function(csv) {
    var dataManager = scaligent.demo.DataManager.getInstance();
    dataManager.parseCSV(csv);

    scaligent.demo.PageController.getInstance()
        .enableAllPages(true)
        .enablePage(scaligent.demo.PageController.PageType.FILE_UPLOAD, false)
        .showPage(scaligent.demo.PageController.PageType.DATA_TABLE);

    scaligent.demo.DataTableView.getInstance().populateTable();
    scaligent.demo.ChartView.getInstance().initChart();
};