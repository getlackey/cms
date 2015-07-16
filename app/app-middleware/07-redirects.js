/*jslint node:true, nomen:true, unparam:true */
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
    redirectRoutes = config.get('redirectRoutes');

module.exports = function (server) {
    server.use(function (req, res, next) {
        var url = req.url;

        redirectRoutes.forEach(function (rule) {
            var ruleParts = rule.split(' '),
                regex = new RegExp(ruleParts[0]);

            if (ruleParts.length !== 2) {
                throw new Error('Invalid Redirect Rule ' + rule);
            }

            if (regex.test(url)) {
                url = url.replace(regex, ruleParts[1]);
                return true;
            }
        });

        if (url !== req.url) {
            res.redirect(302, url);
        } else {
            next();
        }
    });
};