'use strict';
var request = require('request');

var _ = require('ramda');
var Scrapper = function (terms) {
    this.terms = terms;
};
var npmresults = null;
Scrapper.prototype.search = function (cb) {
    var url = 'https://api.npms.io/v2/search?q=@nodulus/' + encodeURIComponent(this.terms);

    if (!npmresults) {
        request(url, function (err, res, body) {
            if (err) {
                return cb(err);
            }
            var parsedResults = JSON.parse(body);
            this.results = parsedResults.results.map((item) => {
                return {
                    name: item.package.name,
                    description: item.package.description,
                    version: item.package.version,
                    url: item.package.url
                };
            });      
  

           
          
            cb(null, this.results);
        }.bind(this));
    }
    else {
        cb(null, npmresults);
    }

};

module.exports = Scrapper;
