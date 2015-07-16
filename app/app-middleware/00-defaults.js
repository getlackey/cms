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


var methodOverride = require('method-override'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    multer = require('multer');

module.exports = function (server) {
    // reads the method from the querystring: ?_method=DELETE
    server.use(methodOverride('_method'));

    server.use(bodyParser.urlencoded({
        extended: true
    }));

    server.use(bodyParser.json());

    server.use(multer({
        dest: './uploads/'
    }));

    server.use(cookieParser());
};