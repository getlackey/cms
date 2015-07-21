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

module.exports = function (app) {
    var Directive,
        Controller;

    Controller = function ($scope, upload) {
        $scope.startLoader = function (elm) {
            elm.find('.form').hide();
            elm.find('.progress').show();
        };

        $scope.stopLoader = function (elm) {
            elm.find('.form').show();
            elm.find('.progress').hide();
        };
        // uses https://github.com/leon/angular-upload
        $scope.doUpload = function (evt) {
            var elm = angular.element(evt.target).parents('lk-upload'),
                file = elm.find('input');

            if (!file) {
                return;
            }

            $scope.startLoader(elm);

            upload({
                url: $scope.url,
                method: $scope.method || 'POST',
                data: {
                    file: file // a jqLite type="file" element, upload() will extract all the files from the input and put them into the FormData object before sending.
                }
            }).then(
                function (response) { //success
                    $scope.stopLoader(elm);

                    if ($scope.onComplete) {
                        $scope.onComplete(response);
                    }

                    if ($scope.onSuccess) {
                        $scope.onSuccess(response);
                    }

                    if (!$scope.onSuccess && !$scope.onComplete) {
                        document.location = document.location.href;
                    }

                    file.val('');
                },
                function (response) { //error
                    $scope.stopLoader(elm);

                    if ($scope.onComplete) {
                        $scope.onComplete(response);
                    }
                    if ($scope.onError) {
                        $scope.onError(response);
                    }
                    if (!$scope.onError && !$scope.onComplete) {
                        window.alert('An error occurred while uploading the file');
                    }

                    file.val('');
                }
            );
        };
    };

    app.controller('lkUpload.ctrl', ['$scope', 'upload', Controller]);

    Directive = function () {
        var directive = {};

        directive.restrict = 'E';

        directive.scope = {
            url: '@',
            method: '@',
            accept: '@',
            onUpload: '&',
            onSuccess: '&',
            onError: '&',
            onComplete: '&'
        };

        directive.template = function (elm, attr) {
            var html = '';

            html += '<div class="form">';
            html += '  <input name="files.file" model="files.file" type="file"';

            if (attr.accept) {
                html += 'accept="' + attr.accept + '"';
            }

            html += '  />';
            html += '  <button>Upload</button>';
            html += '</div>';
            html += '<div class="progress">Loading...</div>';
            return html;
        };

        directive.controller = 'lkUpload.ctrl';

        directive.link = function ($scope, elm) {
            elm.find('button').click($scope.doUpload);
        };

        return directive;
    };

    app.directive('lkUpload', [Directive]);

    return app;
};