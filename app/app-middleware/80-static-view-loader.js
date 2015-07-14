/*jslint node:true, nomen:true */
'use strict';

var path = require('path'),
    fs = require('fs'),
    config = require('config'),
    handler = require('lackey-request-handler');


// generic controller. loads any template that matches the route
// as long as it's listed in the allowedRoutes Array
//
// we use it for any page that doesn't require a specific controller
// with mostly static content or direct mongo queries in the dustjs templates
module.exports = function (server) {
    server.use(handler(function (o) {
        var serveStaticTemplates = config.get('serveStaticTemplates'),
            template = o.req.url.split('?')[0],
            tryFiles;

        if (serveStaticTemplates === false) {
            return o.next();
        }

        // validate template name. not allowing underscore 
        // prevents direct access to partials
        if (!/[a-z\-\/]/.test(template)) {
            return o.next();
        }

        tryFiles = function (routes, cb) {
            var route = routes.shift(),
                basePath = path.dirname(__dirname),
                templateFile = path.join(basePath, 'views', route + '.dust');

            fs.exists(templateFile, function (exists) {
                if (exists) {
                    if (route[0] === '/') {
                        //.substring(1) removes the first /
                        route = route.substring(1);
                    }

                    o.handleOutput('html:' + route)({
                        template: route
                    });

                    cb(true);
                } else {
                    if (routes.length > 0) {
                        tryFiles(routes, cb);
                    } else {
                        cb(false);
                    }
                }
            });
        };

        tryFiles([
            template,
            path.join(template, 'index')
        ], function (loaded) {
            if (!loaded) {
                o.next();
            }
        });
    }));
};