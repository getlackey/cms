/*jslint node:true, unparam:true */
'use strict';

var config = require('config'),
    auth = require('../lib/auth');

module.exports = function (server) {
    //loads user details if logged in
    server.use(auth.checkLoggedIn());

    server.use(function (req, res, next) {
        var locals = res.locals,
            url = require('url');

        // this file is used in some express middleware
        // which makes it run several times per request.
        // we only need to update the data once.
        if (locals.url) {
            return;
        }

        locals.url = url.parse(req.originalUrl);
        locals.url.toString = function () {
            return req.originalUrl;
        };

        locals.url.pathname = locals.url.pathname.split('/');
        while (locals.url.pathname[0] === '') {
            locals.url.pathname = locals.url.pathname.slice(1);
        }
        locals.url.pathname.toString = function () {
            return '/' + locals.url.pathname.join('/');
        };

        locals.req = {
            query: req.query,
            params: req.params
        };
        locals.env = process.env.NODE_ENV || 'development';
        locals.baseUrl = config.get('baseUrl');

        next();
    });
};