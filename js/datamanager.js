/**
 * @fileoverview One place to manage the chart data
 *
 * We could use sqlite but the data is pretty simple for that.
 * We will store the data this way:
 *
 * One array of year values
 * One hash country_code -> country_name
 * One hash country_code -> population_values_array
 */

/**
 * @constructor
 */
scaligent.demo.DataManager = function() {
    /**
     * @type {Array.<string>}
     * @private
     */
    this.yearValues_ = [];

    /**
     * @type {Object.<string, string>}
     * @private
     */
    this.countryName_ = {};

    /**
     * @type {Object.<string, Array.<number>}
     * @private
     */
    this.populationValues_ = {};
};
scaligent.demo.Util.addSingletonGetter(scaligent.demo.DataManager);

/**
 * @param {string} csvData
 */
scaligent.demo.DataManager.prototype.parseCSV = function(csvData) {
    var lines = csvData.split("\n");

    // first line is the header
    this.yearValues_ = lines[0].split(',').splice(2);

    // rest is data
    var dataLines = lines.splice(1);
    dataLines.forEach($.proxy(function(line) {
        var fields = $.csv.toArray(line);
        if (!fields) { return; }

        var cname = fields[0];
        var ccode = fields[1];
        var popValues = fields.splice(2);
        this.countryName_[ccode] = cname;
        this.populationValues_[ccode] = popValues.map(function(x) { return parseInt(x, 10) || 0; });

        // sanity check: population value count should be same as year value count.
        // be smart: pad with zeroes or truncate pop values if the count is off
        var numYears = this.yearValues_.length;
        var pv = this.populationValues_[ccode];
        if (pv.length != numYears) {
            if (pv.length > numYears) {
                pv.splice(numYears);
            } else {
                while (pv.length != numYears) {
                    pv.push(0);
                }
            }
        }
    }, this));
};

/**
 * @return {Array.<string>}
 */
scaligent.demo.DataManager.prototype.getYearValues = function() {
    return this.yearValues_;
};

/**
 * @return {Array.<string>}
 */
scaligent.demo.DataManager.prototype.getCountryCodes = function() {
    var ccodes = [];
    $.each(this.countryName_, function(ccode, cname) {
        ccodes.push(ccode);
    });
    return ccodes;
};

/**
 * @param {string} ccode
 * @return {string}
 */
scaligent.demo.DataManager.prototype.getCountryName = function(ccode) {
    return this.countryName_[ccode] || '';
};

/**
 * @param {string} ccode
 * @return {Array.<number>}
 */
scaligent.demo.DataManager.prototype.getPopulationValues = function(ccode) {
    return this.populationValues_[ccode] || [];
};