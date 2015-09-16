/*jslint node:true, browser:true, unparam:true */
/*global angular, AlloyEditor */
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
    app.directive('lkWysiwyg', function () {
        var directive = {};

        directive.restrict = 'A';

        directive.link = function ($scope, element, attr, lkEdit) {

            element.on('focus', function () {
                if (element.hasClass('ae-editable')) {
                    return;
                }

                AlloyEditor.editable(element.get(0), {
                    toolbars: {
                        add: {
                            buttons: ['image', 'quote', 'h1', 'ul', 'hline', 'table'],
                            tabIndex: 2
                        },
                        styles: {
                            selections: [{
                                name: 'link',
                                buttons: ['linkEdit'],
                                test: AlloyEditor.SelectionTest.link
                            }, {
                                name: 'image',
                                buttons: ['imageLeft', 'imageRight'],
                                test: AlloyEditor.SelectionTest.image
                            }, {
                                name: 'text',
                                buttons: ['removeFormat', 'bold', 'italic', 'underline', 'link', 'twitter'],
                                test: AlloyEditor.SelectionTest.text
                            }, {
                                name: 'table',
                                buttons: ['tableRow', 'tableColumn', 'tableCell', 'tableRemove'],
                                getArrowBoxClasses: AlloyEditor.SelectionGetArrowBoxClasses.table,
                                setPosition: AlloyEditor.SelectionSetPosition.table,
                                test: AlloyEditor.SelectionTest.table
                            }],
                            tabIndex: 1
                        }
                    }
                });
            });
        };

        return directive;
    });

    return app;
};