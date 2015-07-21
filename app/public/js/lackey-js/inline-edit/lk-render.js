/*jslint node:true, browser:true, unparam:true, regexp: true */
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

var view = require('../views'),
    clone = require('clone'),
    dots2brackets = require('dots2brackets'),
    deep = require('deep-get-set');

module.exports = function (app) {
    app.directive('lkRender', function (Restangular, $http, $timeout) {
        var directive = {};

        directive.require = '^lkEdit';

        directive.restrict = 'E';

        directive.scope = {
            model: '=',
            hook: '=',
            expose: '@'
        };

        directive.link = function ($scope, element, attr, lkEdit) {
            var varName = '',
                data;

            if (attr.name) {
                varName += 'data.' + attr.name;
            } else {
                varName += 'model';
            }

            // Get Data
            if (attr.name) {
                data = lkEdit.getData(attr.name);
                $scope.data = data;
            } else {
                if ($scope.model === undefined) {
                    throw new Error('at least a name or model property must be defined');
                }
            }

            function getData(data) {
                var context = {};

                // save main obj
                context[$scope.expose || 'items'] = clone(data);
                // add dustjs env vars to make it possible to reuse
                // dustjs server side helpers
                context.isEdit = true;

                return context;
            }

            $scope.$watch(dots2brackets(varName), function (data) {
                var tplName = attr.template;
                if (data === undefined || data === null) {
                    return;
                }

                view.render(tplName, getData(data), function (err, html) {
                    if (err) {
                        throw err;
                    }

                    element.html(html);

                    if ($scope.hook) {
                        $scope.hook(element);
                    }
                });
            }, true);
        };

        return directive;
    });

    return app;
};