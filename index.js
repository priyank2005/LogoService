var method = LogoService.prototype;
var Twitter = require('twitter');
var WordPOS = require('wordpos');
var NodeCache = require("node-cache");

function LogoService(twitterConfig, returnFirst) {
    this._twitterClient = new Twitter(twitterConfig);
    this._wordPos = new WordPOS();
    this._cacheObj = new NodeCache();
    if (!returnFirst || returnFirst != true){
        this._returnFirst = false;
    }else{
        this._returnFirst = true;
    }
}

method.getLogoForName = function(name, callback) {
    if (!callback) {
        return;
    }
    if (!name) {
        var err = {
            err: 'NoNamePassed',
            text: 'No Name passed for logo'
        }
        callback(err, undefined);
        return;
    }
    var cacheName = 'ImageFromBrand_' + name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    var that = this;
    this._wordPos.getPOS(name, function(result) {
        var queryString = null;
        if (result.rest && result.rest.length > 0) {
            queryString = result.rest.join(' ');
        } else if (result.nouns && result.nouns.length > 0) {
            queryString = result.nouns.join(' ');
        } else if (result.verbs && result.verbs.length > 0) {
            queryString = result.verbs.join(' ');
        } else if (result.adjectives && result.adjectives.length > 0) {
            queryString = result.adjectives.join(' ');
        } else if (result.adverbs && result.adverbs.length > 0) {
            queryString = result.adverbs.join(' ');
        }
        if (queryString) {
            var param = {
                q: queryString,
                count: 10
            };
            that._twitterClient.get('users/search', param, function(error, tweets, response) {
                var maxRatio = 0;
                var image = null;
                for (var i = 0; i < tweets.length; i++) {
                    var tweet = tweets[i];
                    if (!tweet.followers_count || parseInt(tweet.followers_count) == 0) {
                        tweet.followers_count = 0;
                    }
                    if (!tweet.friends_count || parseInt(tweet.friends_count) == 0) {
                        tweet.friends_count = 1;
                    }
                    var ratio = parseInt(tweet.followers_count) / parseInt(tweet.friends_count);
                    if (ratio > maxRatio && tweet.profile_image_url) {
                        image = tweet.profile_image_url.replace('_normal', '');
                        maxRatio = ratio;
                        if (that._returnFirst){
                            break;
                        }
                    }
                }
                if (image) {
                    that._cacheObj.set(cacheName, image, function(err, data) {});
                }
                callback(undefined, image);
            });
        } else {
            var err = {
                err: 'UnableToFormQuery',
                text: 'Unable to form a twitter query'
            }
            callback(err, undefined);
        }
    })
}

module.exports = LogoService;