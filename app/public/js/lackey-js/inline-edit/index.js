/*jslint node:true, browser:true, unparam:true */
/*global angular */
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

var inlineEdit = require('lackey-inline-edit'),
    ngUpload = require('angular-upload'),
    lkUpload = require('./lk-upload'),
    lkRender = require('./lk-render'),
    lkWysiwyg = require('./lk-wysiwyg'),
    app;


module.exports = function () {
    // Our app - choose a name, this is just an example
    app = angular.module('lkEdit', ['restangular', 'ngSanitize', 'lr.upload']);

    app.config(function (RestangularProvider) {
        // This defines where our REST API is defined
        //RestangularProvider.setBaseUrl('');

        // prevent restangular from caching requests
        RestangularProvider.addResponseInterceptor(function (data, operation, what, url, response) {
            var headers = response.headers();
            delete headers.etag;

            return data;
        });
    });

    app = inlineEdit(app);
    // re-renders a dust template whenever a scope var changes
    app = lkRender(app);

    app = lkUpload(app);
    app = lkWysiwyg(app);

    return app;
};