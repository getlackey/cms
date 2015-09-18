/*jslint node:true, nomen:true */
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


var ActivityStream = require('../../models/activity-stream'),
    handler = require('lackey-request-handler'),
    auth = require('../../lib/auth');

/**
 * @swaggerTag
 * ActivityStreams:
 *   description: All methods that change data (POST/PUT/DELETE) across the API are logged
 */
module.exports = function (router) {
    /**
     * @SwaggerPath
     *   /activity-streams:
     *     get:
     *       summary: Get the latest items
     *       tags:
     *         - ActivityStreams
     *       responses:
     *         200:
     *           description: OK
     */
    router.get('/',
        auth.isAny('admin developer'),
        handler(function (o) {
            ActivityStream
                .find(o.find())
                .select(o.select('author method url createdAt updatedAt response'))
                .sort(o.sort('-_id'))
                .limit(o.limit(20))
                .skip(o.skip())
                .populate('author')
                .lean(true)
                .exec()
                .then(o.formatOutput('_id:id author.email author.name author.group method url createdAt updatedAt response'))
                .then(o.handleOutput('html:activity-streams json jsonapi:activity-streams'))
                .then(o.handle404(), o.handleError());
        }));
    /**
     * @SwaggerPath
     *   /activity-streams/{id}:
     *     get:
     *       summary: Get data for one item
     *       tags:
     *         - ActivityStreams
     *       parameters:
     *         - name: id
     *           in: path
     *           description: The item ID
     *           required: true
     *           type: string
     *       responses:
     *         200:
     *           description: OK
     *         400:
     *           description: Invalid ID format
     */
    router.get('/:id',
        auth.isAny('admin developer'),
        handler(function (o) {
            ActivityStream
                .findOne(o.getFilter('id:ObjectId(_id),slug'))
                .lean(true)
                .exec()
                .then(o.formatOutput('_id:id *'))
                .then(o.handleOutput('json'))
                .then(o.handle404())
                .then(null, o.handleError());
        }));
};