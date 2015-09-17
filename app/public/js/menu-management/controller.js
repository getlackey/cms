/*jslint node:true, browser:true */
'use strict';
/*global angular */
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
var dots2brackets = require('dots2brackets'),
    deep = require('deep-get-set');

module.exports = function (app) {
    app.controller('menuManagement', function ($scope) {
        $scope.addItem = function () {
            var elm = angular.element('.menu-items lk-var:first'),
                elmScope = elm.scope(),
                items = deep(elmScope, elmScope.varName);

            if (!$scope.item || !$scope.item.label || !$scope.item.url) {
                return window.alert('You must provide a Label and URL');
            }

            // only add if is new item
            if (items.indexOf($scope.item) === -1) {
                items.push({
                    label: $scope.item.label,
                    url: $scope.item.url
                });
            }

            // clear form 
            $scope.item = {
                label: '',
                url: ''
            };
        };

        $scope.editItem = function (item) {
            $scope.item = item;
        };

        $scope.moveItem = function (item, direction) {
            var elm = angular.element('.menu-items lk-var:first'),
                elmScope = elm.scope(),
                items = deep(elmScope, elmScope.varName),
                currentIndex = items.indexOf(item),
                newIndex = currentIndex + direction;

            if (currentIndex === -1) {
                throw new Error('item is not found');
            }

            if (newIndex < 0 || newIndex > items.length - 1) {
                return;
            }

            items.splice(currentIndex, 1);
            items.splice(newIndex, 0, item);
        };
    });
};