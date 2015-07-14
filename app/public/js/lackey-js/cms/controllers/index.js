/*jslint node:true, browser:true */
'use strict';

module.exports = {
    'default': function (app) {
        app.controller('cmsGrid', function ($scope, restEntity, $sce) {
            var populateScope = require('./populate-scope');
            populateScope($scope, restEntity, $sce);
        });
    },
    imports: require('./imports')
};