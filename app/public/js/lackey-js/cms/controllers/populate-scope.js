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

var optionsParser = require('lackey-options-parser');

module.exports = function ($scope, restEntity, $sce) {
    var elm,
        dataColumns;

    elm = document.getElementById('main-grid');
    dataColumns = optionsParser(elm.getAttribute('data-columns')).stripUnderscores().makeTitle();


    if (!elm) {
        throw new Error('unable to find grid container element with id main-grid');
    }

    $scope.data = {
        title: $sce.trustAsHtml('...')
    };
    restEntity.setTitle($scope, 'title');

    if ($scope.myColumns === undefined) {
        $scope.myColumns = [];

        Object.keys(dataColumns).forEach(function (key) {
            $scope.myColumns.push({
                field: key,
                displayName: dataColumns[key]
            });
        });

        //add actions
        if ($scope.addActions) {
            $scope.addActions();
        } else {
            $scope.myColumns.push({
                displayName: '',
                cellTemplate: 'views/ng-templates/ng-grid-actions.html',
                width: '100px'
            });
        }
    }

    $scope.filterOptions = {
        filterText: '',
        useExternalFilter: false
    };

    if ($scope.myData === undefined) {
        $scope.myData = restEntity.fetchItems({
            include: Object.keys(dataColumns).join(','),
            find: {}
        });
    }

    if ($scope.gridOptions === undefined) {
        $scope.gridOptions = {
            data: 'myData',
            enableColumnResize: true,
            enableColumnReordering: false,
            enableRowReordering: false,
            filterOptions: $scope.filterOptions,
            showFilter: false,
            columnDefs: 'myColumns',
            enableSorting: true,
            rowHeight: 40,
            headerRowHeight: 40
        };
    }

    if ($scope.deleteThisRow === undefined) {
        $scope.deleteThisRow = function (item) {
            var index = $scope.myData.indexOf(item),
                isConfirmed = window.confirm('Are you really sure you want to delete?');

            if (!isConfirmed) {
                return;
            }

            // remove from scope
            if (index > -1) {
                $scope.myData.splice(index, 1);
            }
            // remove from the REST service
            item.remove().then(function () {
                $scope.$emit('deletedItem');
            }, function (err) {
                window.alert('Unable to delete Item');
            });
        };
    }

    if ($scope.editThisRow === undefined) {
        $scope.editThisRow = function (item) {
            if (!item.slug && !item.id) {
                throw new Error('unable to find item\'s slug');
            }
            document.location = restEntity.entityName + '/' + (item.slug || item.id);
        };
    }

    $scope.formItem = {}; //item being created or edited
    $scope.showForm = false;

    $scope.toggleFormVisibility = function ($event) {
        if ($scope.showForm) {
            return $scope.resetForm($event);
        }
        $scope.showForm = true;
    };

    $scope.submitForm = function ($event) {
        restEntity.save($scope.formItem, function () {
            $scope.$emit('addedItem');
        });

        $scope.resetForm($event);
        $event.preventDefault();
    };

    $scope.resetForm = function ($event) {
        $scope.formItem = {};
        $scope.showForm = false;

        $event.preventDefault();
    };

    return $scope;
};