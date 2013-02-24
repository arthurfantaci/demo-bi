/**
 * @fileoverview Code to manage the viewing of a data table on the dom
 */

/**
 * @constructor
 */
scaligent.demo.ChartView = function() {
    /**
     * @type {Element}
     * @private
     */
    this.containerEl_;

    /**
     * @type {Element}
     * @private
     */
    this.countryChoiceListEl_;

    /**
     * @type {Element}
     * @private
     */
    this.lineChartRadioEl_;

    /**
     * @type {Element}
     * @private
     */
    this.scatterChartRadioEl_;

    /**
     * @type {Element}
     * @private
     */
    this.logMessageEl_;

    /**
     * @type {Highlights.Chart}
     * @private
     */
    this.chart_;

    /**
     * @type {Object.<string, Highlights.Series>}
     * @private
     */
    this.seriesCache_ = {};

    /**
     * This is set to true for the duration the mouse is dragged over the chart
     * @type {boolean}
     * @private
     */
    this.canSelectPoints_ = false;
};
scaligent.demo.Util.addSingletonGetter(scaligent.demo.ChartView);

/**
 * @param {Element} containerEl
 * @param {Element} countryChoiceListEl
 * @param {Element} lineChartRadioEl
 * @param {Element} scatterChartRadioEl
 * @param {Element} logMessageEl
 */
scaligent.demo.ChartView.prototype.init = function(containerEl, countryChoiceListEl, lineChartRadioEl,
                                                   scatterChartRadioEl, logMessageEl) {
    this.containerEl_ = containerEl;
    this.countryChoiceListEl_ = countryChoiceListEl;
    this.lineChartRadioEl_ = lineChartRadioEl;
    this.scatterChartRadioEl_ = scatterChartRadioEl;
    this.logMessageEl_ = logMessageEl;

    // handle the chart choice radio buttons
    $(this.lineChartRadioEl_).change($.proxy(this.changeChart_, this));
    $(this.scatterChartRadioEl_).change($.proxy(this.changeChart_, this));
};

/**
 * We can consider passing the datamanager if it makes for a better design
 */
scaligent.demo.ChartView.prototype.initChart = function() {
    if (!this.containerEl_) {
        return;
    }

    this.initHighchartOptions_();
    this.changeChart_();

    this.populateCountryChoiceList_();
    this.showChartForCountry_('USA', true);
    $('.checkbox-USA')[0].checked = true;
};

/**
 * @private
 */
scaligent.demo.ChartView.prototype.initHighchartOptions_ = function() {
    var dm = scaligent.demo.DataManager.getInstance();
    var yearValues = dm.getYearValues();

    Highcharts.setOptions({
        colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
        chart: {
            renderTo: this.containerEl_,
            backgroundColor: {
                linearGradient: [0, 0, 500, 500],
                stops: [
                    [0, 'rgb(255, 255, 255)'],
                    [1, 'rgb(240, 240, 255)']
                ]
            }
            ,
            borderWidth: 2,
            plotBackgroundColor: 'rgba(255, 255, 255, .9)',
            plotShadow: true,
            plotBorderWidth: 1
        },
        title: {
            text: 'World Population',
            style: {
                color: '#000',
                font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
            }
        },
        subtitle: {
            text: 'Source: Scaligent',
            style: {
                color: '#666666',
                font: 'bold 12px "Trebuchet MS", Verdana, sans-serif'
            }
        },
        xAxis: {
            categories: yearValues,
            tickInterval: 5,
            gridLineWidth: 1,
            lineColor: '#000',
            tickColor: '#000',
            labels: {
                style: {
                    color: '#000',
                    font: '11px Trebuchet MS, Verdana, sans-serif'
                }
            },
            title: {
                style: {
                    color: '#333',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'

                }
            }
        },
        yAxis: {
            alternateGridColor: null,
            minorTickInterval: 'auto',
            lineColor: '#000',
            lineWidth: 1,
            tickWidth: 1,
            tickColor: '#000',
            labels: {
                style: {
                    color: '#000',
                    font: '11px Trebuchet MS, Verdana, sans-serif'
                }
            },
            min: 0,
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }],
            title: {
                text: 'Population',
                style: {
                    color: '#333',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            }
        },
        legend: {
            itemStyle: {
                font: '9pt Trebuchet MS, Verdana, sans-serif',
                color: 'black'

            },
            itemHoverStyle: {
                color: '#039'
            },
            itemHiddenStyle: {
                color: 'gray'
            }
        },
        legend_old: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 100,
            y: 70,
            floating: true,
            backgroundColor: '#FFFFFF',
            borderWidth: 1
        },
        credits: {
            style: {
                right: '10px'
            }
        },
        labels: {
            style: {
                color: '#99b'
            }
        },
        tooltip: {
            enabled: true,
            formatter: function() {
                return '<b>'+ this.series.name +'</b><br/>'+
                    this.x +': '+ this.y;
            }
        },
        plotOptions: {
            scatter: {
                allowPointSelect: true,
                cursor: 'pointer',
                point: {
                    events: {
                        mouseOver:$.proxy(function(e) {
                            if (this.canSelectPoints_) {
                                e.target.select(true, true);
                            }
                        }, this)
                    }
                }
            }
        }
    });
};

/**
 * @private
 */
scaligent.demo.ChartView.prototype.changeChart_ = function() {
    if (this.chart_) {
        this.chart_.destroy();
        this.chart_ = null;
    }

    if (this.lineChartRadioEl_.checked) {
        this.createLineChart_();
    } else {
        this.createScatterChart_();
    }

    // populate any previously existing series
    var dm = scaligent.demo.DataManager.getInstance();
    $.each(this.seriesCache_, $.proxy(function(ccode, series) {
        if (!!series) {
            this.seriesCache_[ccode] = this.chart_.addSeries({
                name: dm.getCountryName(ccode),
                data: dm.getPopulationValues(ccode)
            });
        }
    }, this));
};

/**
 * @private
 */
scaligent.demo.ChartView.prototype.createLineChart_ = function() {
    this.chart_ = new Highcharts.Chart({
        chart: {
            type: 'line',
            zoomType: 'x'
        }
    });
    this.chart_.redraw();
};

/**
 * Note: Ideally we should consolidate the creation of 2 charts since much is common.
 * See: http://jsfiddle.net/gh/get/jquery/1.7.2/highslide-software/highcharts.com/tree/master/samples/highcharts/members/setoptions/
 *
 * It is possible to change the chart type without destroying and recreating the chart.
 * See: http://stackoverflow.com/questions/10657588/highcharts-dynamically-change-chart-type
 * Only holdup is that I would like the x-axis zoom to work for line chart, and yet to find a way
 * to change it dynamically.
 *
 * @private
 */
scaligent.demo.ChartView.prototype.createScatterChart_ = function() {
    this.chart_ = new Highcharts.Chart({
        chart: {
            type: 'scatter'
        },
        tooltip: {
            enabled: false
        }
    });
    this.chart_.redraw();

    // Add the logic for point selection by dragging mouse over them.
    // TODO: still could not figure out how to draw a rubber band lasso.
    $(this.chart_.container)
        .mousedown($.proxy(function() {
            this.canSelectPoints_ = true;
        }, this))
        .mouseup($.proxy(function() {
            this.canSelectPoints_ = false;
            var selectedPoints = this.chart_.getSelectedPoints();
            var log = '';
            $(selectedPoints).each(function(i, point) {
                log += '[' + point.series.name + '] ' + point.category + ': ' + point.y + '<br>';
                point.select(false);
            });
            $(this.logMessageEl_).html(log);
            $(this.logMessageEl_).dialog({ title: 'Selected points', dialogClass: 'alert' });
        }, this));
};

/**
 * @private
 */
scaligent.demo.ChartView.prototype.populateCountryChoiceList_ = function() {
    var dm = scaligent.demo.DataManager.getInstance();
    var ccodes = dm.getCountryCodes();

    // need to show country names in sorted order
    var ccodeAndCnamePairs = [];
    ccodes.forEach(function(ccode) {
        ccodeAndCnamePairs.push({ccode: ccode, cname: dm.getCountryName(ccode)});
    });
    ccodeAndCnamePairs.sort(function(a, b) {
        return a.cname < b.cname? -1 : 1;
    });

    var countryChoiceItems = [];
    ccodeAndCnamePairs.forEach(function(p) {
        var ccode = p.ccode;
        var cname = p.cname;
        cname = scaligent.demo.Util.truncateStr(cname, 20);
        var checkboxClass = 'checkbox-' + ccode;
        countryChoiceItems.push('<li><input class="'+checkboxClass+'" type="checkbox"></input>'+cname+'</li>');
    });
    $(this.countryChoiceListEl_).html(countryChoiceItems.join(''));

    ccodes.forEach(function(ccode) {
        $('.checkbox-' + ccode).change($.proxy(this.onCountryChoiceChange_, this, ccode));
    }, this);
};

/**
 * @param {string} ccode
 * @param e
 * @private
 */
scaligent.demo.ChartView.prototype.onCountryChoiceChange_ = function(ccode, e) {
    var checkboxEl = e.target;
    this.showChartForCountry_(ccode, checkboxEl.checked);
};

/**
 * @param {string} ccode
 * @param {boolean} show
 * @private
 */
scaligent.demo.ChartView.prototype.showChartForCountry_ = function(ccode, show) {
    var dm = scaligent.demo.DataManager.getInstance();

    if (show) { // add new series
        if (!this.seriesCache_[ccode]) {
            this.seriesCache_[ccode] = this.chart_.addSeries({
                name: dm.getCountryName(ccode),
                data: dm.getPopulationValues(ccode)
            });
        }
    } else {
        if (this.seriesCache_[ccode]) {
            this.seriesCache_[ccode].remove();
            this.seriesCache_[ccode] = null;
        }
    }
};