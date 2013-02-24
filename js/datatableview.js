/**
 * @fileoverview Code to manage the viewing of a data table on the dom
 */

/**
 * @constructor
 */
scaligent.demo.DataTableView = function() {
    /**
     * @type {Element}
     * @private
     */
    this.tableEl_;
};
scaligent.demo.Util.addSingletonGetter(scaligent.demo.DataTableView);

/**
 * @param {Element} tableEl
 */
scaligent.demo.DataTableView.prototype.init = function(tableEl) {
    this.tableEl_ = tableEl;
};

/**
 * We can consider passing the datamanager if it makes for a better design
 */
scaligent.demo.DataTableView.prototype.populateTable = function() {
    if (!this.tableEl_) {
        return;
    }

    var dm = scaligent.demo.DataManager.getInstance();

    var aoColumns = [{"sTitle": "Country", "sClass": "country-col"}];
    dm.getYearValues().forEach(function(year) {
        aoColumns.push({
            "sTitle": year,
            "sClass": "center year-col",
            "fnRender": function(obj) {
                var sReturn = parseInt(obj.aData[obj.iDataColumn], 10);
                if (isNaN(sReturn)) { return 0; }

                // simplify the numbers using K or M -- this introduces a sort bug
                /*
                if (sReturn/1000000 >= 10) {
                    sReturn = Math.round(sReturn/1000000) + 'M';
                } else if (sReturn/1000000 >= 1) {
                    sReturn = parseFloat(sReturn/1000000).toFixed(1) + 'M';
                } else if (sReturn/1000 >= 10) {
                    sReturn = Math.round(sReturn/1000) + 'K';
                } */
                return sReturn;
            }
        });
    });

    var aaData = []; // [country, pop_y1, pop_y2, ...]
    dm.getCountryCodes().forEach(function(ccode) {
        var row = [dm.getCountryName(ccode)].concat(dm.getPopulationValues(ccode));
        aaData.push(row);
    });

    $(this.tableEl_).dataTable({
        "aaData": aaData,
        "aoColumns": aoColumns,
        "sScrollX": "100%"
    });
};