/*jslint node:true, browser:true */
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

var http = require('http'),
    path = require('path'),
    dust = require('dustjs-linkedin'),
    globals = require('../globals'),
    obj = {};

obj.dust = dust;
// extra helpers
obj.dust.helpers = require('dustjs-helpers').helpers;
//load var helper
require('lackey-dustjs-var')(obj.dust);
//load options helper
require('lackey-dustjs-options')(obj.dust);

obj.loadTemplate = function (templatePath, cb) {
    var basePath = '/views/dust/';

    http.get({
        path: path.join(basePath, templatePath + '.js')
    }, function (res) {
        var templateJs = '';

        res.on('data', function (buf) {
            templateJs += buf;
        });
        res.on('end', function () {
            var isResponseValid = ((res.statusCode >= 200 && res.statusCode < 300) || res.statusCode === 304),
                loadTemplate;

            if (!isResponseValid) {
                return cb(new Error('Unable to load template ' + templatePath + ' HTTP/' + res.statusCode));
            }

            /*jslint evil: true */
            loadTemplate = new Function('dust', templateJs);
            /*jslint evil: false */
            loadTemplate(obj.dust);

            cb();
        });
    }).on('error', cb);
};

obj.render = function (template, vars, cb) {
    // injecting some vars that exist on the server side context
    // to make the templates behave in the same manner
    vars.isCMS = globals.isCMS;
    vars.isEdit = globals.isEdit;

    obj.dust.render(template, vars, function (err, html) {
        var missingTemplate = '';

        if (err) {
            if (!/^Template Not Found: /.test(err.message)) {
                return cb(err);
            }
            missingTemplate = err.message.replace(/^Template Not Found: /, '');
            obj.loadTemplate(missingTemplate, function (err) {
                if (err) {
                    return cb(err);
                }
                return obj.render(template, vars, cb);
            });
        } else {
            cb(null, html);
        }
    });
};

module.exports = obj;