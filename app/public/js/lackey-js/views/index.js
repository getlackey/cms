/*jslint node:true, browser:true */
'use strict';

var http = require('http'),
    path = require('path'),
    dust = require('dustjs-linkedin'),
    globals = require('../globals'),
    obj = {};

obj.dust = dust;
// extra helpers
obj.dust.helpers = require('dustjs-helpers').helpers;
//load var helper
require('lackey-dustjs-helpers').var(obj.dust);
//load options helper
require('lackey-dustjs-helpers').options(obj.dust);

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