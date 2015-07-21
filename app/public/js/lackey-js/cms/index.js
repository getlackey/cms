/*jslint node:true, browser:true */
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

var restEntity = require('./providers/rest-entity'),
    controllers = require('./controllers'),
    entityName = document.location.pathname.split('/').pop(),
    lkUploadDirective = require('./directives/lk-upload'),
    app,
    controller,
    cms;

app = angular.module('lkCMS', ['restangular', 'ngGrid', 'angularFileUpload']);

restEntity(app);

app.config(function (restEntityProvider) {
    restEntityProvider.entityName = entityName;
});

lkUploadDirective(app);

cms = function () {
    controller = controllers[entityName] || controllers['default'];
    controller(app);

    return app;
};

cms.controllers = controllers;

module.exports = cms;