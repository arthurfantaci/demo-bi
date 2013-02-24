/**
 * @fileoverview Utilities
 */

scaligent.demo.Util = function() {

};

scaligent.demo.Util.addSingletonGetter = function(ctor) {
    if (typeof(ctor) !== "function") {
        return;
    }

    ctor.getInstance = function() {
        return ctor.instance_ || (ctor.instance_ = new ctor());
    };
};

/**
 * @param {string} str
 * @param {number} threshold
 */
scaligent.demo.Util.truncateStr = function(str, threshold) {
    if (str.length > threshold) {
        return str.substr(0, threshold - 3) + '...';
    }
    return str;
};