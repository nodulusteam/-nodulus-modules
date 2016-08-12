'use strict';
var request = require('request');
var cheerio = require('cheerio');

var Scrapper = function (terms) {
    this.terms = terms;
};
var npmresults = null;
Scrapper.prototype.search = function (cb) {
    var url = 'https://www.npmjs.com/browse/keyword/nodulus-extension'; //+ encodeURIComponent(this.terms)
    if (!npmresults) {
        request(url, function (err, res, body) {
            if (err) {
                return cb(err);
            }

            var $ = cheerio.load(body);
            var results = [];

            $('.package-details').each(function () {
                results.push({
                    name: $(this).find('.name').text(),
                    description: $(this).find('.description').text(),
                    version: $(this).find('.version').text().match(/\d+\.\d+\.\d+/)[0],
                    url: 'https://www.npmjs.com/package/' + $(this).find('.name').text()
                });
            });

            this.results = results;
            npmresults = results;
            cb(null, this.results);
        }.bind(this));
    }
    else {
        cb(null,npmresults);
    }

};

module.exports = Scrapper;
