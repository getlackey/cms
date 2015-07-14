/*jslint node:true, browser:true, unparam:true */
/*global angular */
'use strict';


var inlineEdit = require('lackey-inline-edit'),
    lkRender = require('./lk-render'),
    ngUpload = require('angular-upload'),
    lkUpload = require('./lk-upload'),
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

    return app;
};