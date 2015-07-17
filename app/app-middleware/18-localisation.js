/*jslint node:true, unparam:true, regexp:true  */
'use strict';
/*
    Copyright 2015 Enigma Marketing Services Limited

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/


var modRewrite = require('connect-modrewrite'),
    config = require('config'),
    optionsParser = require('lackey-options-parser'),
    locales = optionsParser(config.get('locales')),
    getLocality,
    parseUrl,
    rewriteFullLocale, // /en/GB/...
    rewritePartialLocale; // /en/...

// We support several localisation formats:
//   /en/articles -> defaults to first found country /en/GB
//   /en/GB/articles
//   / uses the default locale (en_gb?)

// We ignore the header Accept-Language
//
// Unless splicitly stated in the url, the 
// default locale set in the config file will
// be used


// get the language or language/country data from url
// checks if the language exists or if it's just a 2 letter 
// word, eg. /js/main.js - js is not a language
parseUrl = function (url) {
    var obj = {
            country: undefined,
            language: undefined,
            locale: undefined
        },
        match = url.match(/^\/([a-z]{2})(\/([A-Z]{2}))?\/?/),
        language,
        isLanguageValid = false,
        country,
        isCountryValid = false;

    if (!match) {
        return obj;
    }

    language = match[1];
    country = match[3];

    locales.getKeys().some(function (locale) {
        if (language && !isLanguageValid && locale.indexOf(language + '_') === 0) {
            isLanguageValid = true;
        }

        if (isLanguageValid && !country) { // no need to do aditional checks
            return true;
        }

        if (country && isLanguageValid && !isCountryValid && locale.indexOf('_' + country) === 2) {
            isCountryValid = true;
            return true;
        }
    });

    if (isLanguageValid) {
        obj.language = language;
    }

    if (isCountryValid) {
        obj.country = country;
    }
    return obj;
};

// populates the object with the missing data:
//  - the language and country for the default url /...
//  - the country, if the url is similar to /en/...
//  - and finaly, the locale for every request
getLocality = function (obj) {
    var defLocale;

    if (!obj.country && !obj.language) {
        defLocale = config.get('defaultLocale');

        if (!defLocale || !/^[a-z]{2}_[A-Z]{2}$/.test(defLocale)) {
            throw new Error('Invalid default locale');
        }

        if (!locales[defLocale]) {
            throw new Error('Default locale missing from valid locales');
        }

        obj.locale = defLocale;
        obj.language = defLocale.substring(0, 2);
        obj.country = defLocale.substring(3, 5);

        return obj;
    }

    if (!obj.country) {
        locales.getKeys().some(function (locale) {
            if (locale.indexOf(obj.language + '_') === 0) {
                obj.country = locale.substring(3, 5);
                return true;
            }
        });
    }

    obj.locale = obj.language + '_' + obj.country;

    return obj;
};

rewriteFullLocale = modRewrite([
    '^/[a-z]{2}/[A-Z]{2}/?(.*)$ /$1'
]);

rewritePartialLocale = modRewrite([
    '^/[a-z]{2}/?(.*)$ /$1'
]);

module.exports = function (server) {
    server.use(function (req, res, next) {
        var locality = parseUrl(req.url),
            rewriteFunction;

        // determine what part of the url do we need to ignore
        // /en/... => rewritePartialLocale
        // /en/GB/... => rewriteFullLocale
        // /js/GB/.. Ignore nothing, that is not a valid locale
        if (locality.country && locality.language) {
            rewriteFunction = rewriteFullLocale;
        } else if (locality.language) {
            rewriteFunction = rewritePartialLocale;
        }

        locality = getLocality(locality);

        // expose the locality object for the following middleware functions
        req.locality = locality;
        res.set('Content-Language', locality.locale);
        // make it available to dustjs templates
        res.locals.locality = req.locality;

        if (rewriteFunction) {
            rewriteFunction(req, res, next);
        } else {
            next();
        }
    });

    // translate controllers and static templates
    server.use(function (req, res, next) {
        var locale = req.locality.locale,
            localisedRoutes = config.get('localisedRoutes'),
            mapping = localisedRoutes[locale],
            url = req.url;

        if (!localisedRoutes || !mapping) {
            return next();
        }

        // converts the config file to reg exp and applies them 
        // to the url.
        mapping.forEach(function (rules) {
            var ruleParts = rules.split(' '),
                regex = new RegExp(ruleParts[0]);

            if (regex.test(url)) {
                url = url.replace(regex, ruleParts[1]);
            }
        });

        req.url = url;
        next();
    });
};