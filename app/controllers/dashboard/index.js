/*jslint node:true, unparam:true, nomen:true */
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


var Q = require('q'),
    mongoose = require('mongoose'),
    auth = require('../../lib/auth'),
    handler = require('lackey-request-handler'),
    handlerOptions = {
        logger: require('../../lib/logger')
    },
    errorsTtl = 1000 * 60 * 60 * 24 * 7;

module.exports = function (router) {
    router.get('/',
        auth.isAny('admin developer'),
        handler(handlerOptions, function (o) {
            o.res.render('dashboard');
        }));
};