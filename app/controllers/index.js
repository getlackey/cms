/*jslint node:true, unparam:true, nomen:true */
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


var path = require('path'),
    config = require('config'),
    merge = require('merge'),
    handler = require('lackey-request-handler'),
    Page = require('../models/page');

/**
 * @SwaggerHeader
 * info:
 *   title: Lackey CMS API
 *   contact:
 *     name: API Support
 *     email: admin@lackey.io
 *   version: 1.0.0
 * basePath: /
 * consumes:
 *   - application/json
 *   - multipart/form-data
 *   - application/x-www-form-urlencoded
 * produces:
 *   - text/html
 *   - application/json
 */
module.exports = function (router) {
    router.get('/',
        handler(function (o) {
            var find = {
                isHomePage: true
            };

            // hide unpublished items from all other users
            if (!o.res.user || !o.res.user.isAny('admin developer')) {
                find = merge(find, {
                    isPublished: true
                });
            }

            Page
                .findOne(find)
                .lean(true)
                .exec()
                .then(o.formatOutput('_id:id *'))
                .then(o.handleOutput(function (doc) {
                    return 'html:' + doc.template + ' json';
                }))
                .then(o.handle404(), o.handleError());
        }));
};