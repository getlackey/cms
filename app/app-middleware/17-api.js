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


var modRewrite = require('connect-modrewrite');

module.exports = function (server) {
    //hack: force CORS support
    server.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');

        next();
    });

    // We need a different path for the API
    // to prevent having only one response type 
    // cached by appcache or any proxy
    server.use(function (req, res, next) {
        var isHTML = /(.*).html?$/.test(req.path),
            isJSON = /(.*).json$/.test(req.path),
            isXlsx = /(.*).xlsx$/.test(req.path);

        // force accept and content type so it always handles with the mime type
        if (isHTML) {
            req.headers.accept = 'text/html,*/*;q=0.1';
            req.headers['content-type'] = 'text/html';
        } else if (isXlsx) {
            req.headers.accept = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,*/*;q=0.1';
            req.headers['content-type'] = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        } else if (isJSON) {
            req.headers.accept = 'application/json,*/*;q=0.1';
            req.headers['content-type'] = 'application/json';
        }

        next();
    });

    server.use(modRewrite([
        '(.*).json(\\?.*)?$ $1',
        '^(.*).xlsx(\\?.*)?$ $1',
        '^(.*).html?(\\?.*)?$ $1'
    ]));
};