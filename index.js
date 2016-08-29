var util = require('./util');

module.exports = {
    /**
     * this will turn the uri into a series of images?
     * @function capsulate
     * @property uri - url of a website
     */
    capsulate: function capsulate(uri) {
        util.scrapeUrls(uri, function(urls, error) {
            console.log(urls);
            console.log(error);
            util.save(urls, function(results, error) {
                console.log(results);
                console.log(error);
            });
        });
    }
}
