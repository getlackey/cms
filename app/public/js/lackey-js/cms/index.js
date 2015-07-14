/*jslint node:true, browser:true */
/*global angular */
'use strict';

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