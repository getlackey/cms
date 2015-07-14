/*jslint node:true, browser:true */
'use strict';

module.exports = function (app) {
    app.controller('cmsGrid', function ($scope, restEntity, $sce) {
        var populateScope = require('./populate-scope');

        // REST query, filtering the items by type
        $scope.myData = restEntity.fetchItems({
            //     filter: 'type:cms-defined'
        });

        $scope.editThisRow = function (item) {
            if (!item.id) {
                throw new Error('unable to find item\'s id');
            }
            document.location.href = '../../imports/' + item.id;
        };

        restEntity.addActions = function () {
            var self = this;

            self.definitions.push({
                displayName: '',
                cellTemplate: 'views/ng-templates/ng-grid-actions-imports.html',
                width: '100px'
            });
        };

        populateScope($scope, restEntity, $sce);
    });
};