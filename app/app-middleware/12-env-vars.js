/*jslint node:true, unparam:true */
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