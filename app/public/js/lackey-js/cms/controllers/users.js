/*jslint node:true, browser:true */
'use strict';

module.exports = function (app) {
    app.controller('cmsGrid', function ($scope, restEntity, $sce) {
        var populateScope = require('./populate-scope');

        $scope.editThisRow = function (item) {
            if (!item.email) {
                throw new Error('unable to find user\'s email');
            }
            $scope.formItem = item;
            $scope.showForm = true;
        };

        populateScope($scope, restEntity, $sce);
    });
};