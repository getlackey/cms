/*jslint node:true, browser:true, unparam:true */
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
    app.directive('lkUpload', function ($upload) {
        var directive = {};

        directive.restrict = 'E';

        directive.scope = {
            action: '@' //url to post to
        };

        directive.template = function (elm, attributes) {
            var html = '',
                label = elm.text() || 'Click here to select file';

            html += '<button ng-file-select="onFileSelect($files)" onclick="this.value = null" class="upload-button">';
            html += label;
            html += '</button>';

            return html;
        };

        directive.link = function ($scope, element, attributes) {
            $scope.onFileSelect = function ($files) {
                var i = 0,
                    file;

                //$files: an array of files selected, each file has name, size, and type.
                $files.forEach(function () {
                    file = $files[i]; // we are limiting this to one file per upload
                    $scope.upload = $upload
                        .upload({
                            url: $scope.action,
                            method: 'POST',
                            file: file
                        })
                        .progress(function (evt) {
                            console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total, 10));
                        })
                        .success(function (doc) {
                            var msg = 'Uploaded';
                            window.alert(msg);
                        })
                        .error(function (err) {
                            var msg = err.message || 'An error occurred';
                            window.alert(msg);
                        });
                });
            };
        };

        return directive;
    });

    return app;
};