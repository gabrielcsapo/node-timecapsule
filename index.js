var util = require('./util');

module.exports = {
    /**
     * this will turn the uri into a series of images?
     * @function capsulate
     * @property uri - url of a website
     */
    capsulate: function capsulate(uri) {
        util.scrapeUrls(uri, function(value, error) {
            console.log(value);
            console.log(error);
        });
    }
}
