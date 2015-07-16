/*jslint node:true, browser:true */
'use strict';

var $ = window.jQuery || require('jquery');

module.exports = function (app) {
    app.controller('cmsGrid', function ($scope, restEntity, $sce) {
        var populateScope = require('./populate-scope');

        $scope.addActions = function () {
            $scope.myColumns.push({
                displayName: '',
                cellTemplate: 'views/ng-templates/ng-grid-actions-pages.html',
                width: '100px'
            });
        };

        $scope.editThisRow = function (item) {
            if (!item.path) {
                throw new Error('unable to find page path');
            }

            document.location = restEntity.entityName + '/' + item.path;
        };

        $scope.addChildToThisRow = function (item) {
            var baseTag = document.getElementsByTagName('base')[0],
                url = (baseTag.href || '/') + restEntity.entityName,
                newTitle = window.prompt('Provide a title for the page');

            if (!item.slug && !item.id) {
                throw new Error('unable to find item\'s id');
            }

            if (newTitle === null) {
                return;
            }

            $.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify({
                    title: newTitle,
                    parent: (item.id || item.slug)
                }),
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    var redirectUrl = (baseTag.href || '/') + restEntity.entityName + '/' + data.id;
                    document.location.href = redirectUrl;
                },
                error: function () {
                    window.alert('There was an error creating the page');
                },
                dataType: 'json'
            });
        };
        populateScope($scope, restEntity, $sce);
    });
};