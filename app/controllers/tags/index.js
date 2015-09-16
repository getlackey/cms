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


var config = require('config'),
    handler = require('lackey-request-handler'),
    mongooseUtils = require('lackey-mongoose-utils'),
    cms = require('../../lib/cms'),
    auth = require('../../lib/auth'),
    Tag = require('../../models/tag'),
    handlerOptions = {
        logger: require('../../lib/logger'),
        // NOTE: remember to keep doc/comments in sync
        limit: 100,
        skip: 10000,
        sort: '_id slug createdAt'
    };

cms.register({
    controller: 'tags',
    columns: 'title slug locale createdAt'
});

/**
 * @swaggerTag
 * tag:
 *   description: Tag
 */
module.exports = function (router) {
    /**
     * @SwaggerPath
     *   /tags:
     *     get:
     *       summary: Get list of Items
     *       description: Get list of tags
     *       tags:
     *         - tag
     *       parameters:
     *         - name: find
     *           in: query
     *           description: JSON Query. Uses MongoDB notation.
     *           required: false
     *           type: string
     *         - name: select
     *           in: query
     *           description: CSV. Properties to return in the response.
     *           required: false
     *           type: string
     *         - name: include
     *           in: query
     *           description: CSV. Properties to add to the response.
     *           required: false
     *           type: string
     *         - name: exclude
     *           in: query
     *           description: CSV. Properties to remove from response.
     *           required: false
     *           type: string
     *         - name: sort
     *           in: query
     *           description: CSV. Sort by property (_id, slug, createdAt). Prefixing with dash (-) reverts order.
     *           required: false
     *           type: string
     *         - name: skip
     *           in: query
     *           description: Number of items to skip up to 10000.
     *           required: false
     *           type: integer
     *           format: int32
     *         - name: limit
     *           in: query
     *           description: Max records to return up to 100.
     *           required: false
     *           type: integer
     *           format: int32
     *       responses:
     *         200:
     *           description: OK
     */
    router.get('/',
        handler(handlerOptions, function (o) {
            Tag
                .find(o.find())
                .checkAcl(o.res.user)
                .select(o.select('title slug'))
                .sort(o.sort('-_id'))
                .limit(o.limit(10))
                .skip(o.skip())
                .lean(true)
                .exec()
                .then(o.formatOutput('_id:id *'))
                .then(o.handleOutput())
                .then(o.handle404(), o.handleError());
        }));
    /**
     * @SwaggerPath
     *   /tags/{id}:
     *     get:
     *       summary: Get data for one item
     *       description: Several elements can be used as an unique identifier.
     *         You can use the ObjectId provided as **id** or the **slug**.
     *       tags:
     *         - tag
     *       parameters:
     *         - name: id
     *           in: path
     *           description: The item Identifier (ObjectID, Slug or one of the IDs)
     *           required: true
     *           type: string
     *       responses:
     *         200:
     *           description: OK
     *         400:
     *           description: Invalid ID format
     */
    router.get('/:id',
        handler(handlerOptions, function (o) {
            Tag
                .findOne(o.getFilter('id:ObjectId(_id),slug'))
                .lean(true)
                .exec()
                .then(Tag.checkAcl(o.res.user))
                .then(o.formatOutput('_id:id *'))
                .then(o.handleOutput())
                .then(o.handle404(), o.handleError());
        }));
    /**
     * @SwaggerPath
     *   /tags:
     *     post:
     *       summary: Create a new item
     *       tags:
     *         - tag
     *       parameters:
     *         - name: body
     *           in: body
     *           description: The item data. May be provided as a JSON body, an uploaded JSON file or as formData
     *           required: true
     *           schema:
     *             $ref: '#/definitions/Tag'
     *       responses:
     *         200:
     *           description: OK
     */
    router.post('/',
        auth.isAny('admin developer'),
        handler(handlerOptions, function (o) {
            o.getBody()
                .then(function (doc) {
                    //only developers manage system tags
                    if (doc.type === 'system' && !o.res.user.is('developer')) {
                        return o.next(new errors.HttpStatusError(403));
                    }

                    Tag
                        .create(merge(doc, {
                            author: o.res.user && o.res.user._id
                        }))
                        .then(o.formatOutput('_id:id'))
                        .then(o.handleOutput())
                        .then(o.handle404(), o.handleError());
                })
                .then(null, o.handleError());
        }));
    /**
     * @SwaggerPath
     *   /tags/{id}:
     *     put:
     *       summary: Update data for one item
     *       description: Several elements can be used as an unique identifier.
     *         You can use the ObjectId provided as **id** or the **slug**.
     *       tags:
     *         - tag
     *       parameters:
     *         - name: id
     *           in: path
     *           description: The item Identifier (ObjectID, Slug or one of the IDs)
     *           required: true
     *           type: string
     *       responses:
     *         200:
     *           description: OK
     *         400:
     *           description: Invalid ID format
     */
    router.put('/:id',
        auth.isAny('admin developer'),
        handler(handlerOptions, function (o) {
            o.getBody()
                .then(function (doc) {
                    //only developers manage system tags
                    if (doc.type === 'system' && !o.res.user.is('developer')) {
                        return o.next(new errors.HttpStatusError(403));
                    }

                    Tag
                        .findOne(o.getFilter('id:ObjectId(_id)'))
                        .exec()
                        .then(o.handle404())
                        .then(mongooseUtils.update(merge(doc, {
                            author: o.res.user && o.res.user._id
                        })))
                        .then(mongooseUtils.save)
                        .then(o.formatOutput('_id:id'))
                        .then(o.handleOutput())
                        .then(null, o.handleError());
                })
                .then(null, o.handleError());
        }));
    /**
     * @SwaggerPath
     *   /tags/{id}:
     *     delete:
     *       summary: Delete one item
     *       description: Several elements can be used as an unique identifier.
     *         You can use the ObjectId provided as **id** or the **slug**.
     *       tags:
     *         - tag
     *       parameters:
     *         - name: id
     *           in: path
     *           description: The item Identifier (ObjectID, Slug or one of the IDs)
     *           required: true
     *           type: string
     *       responses:
     *         200:
     *           description: OK
     *         400:
     *           description: Invalid ID format
     */
    router['delete']('/:id',
        auth.isAny('admin developer'),
        handler(handlerOptions, function (o) {
            Tag
                .findOne(o.getFilter('id:ObjectId(_id)'))
                .exec()
                .then(mongooseUtils.remove)
                .then(o.handleOutput())
                .then(o.handle404(), o.handleError());
        }));
    /**
     * @SwaggerDefinitions
     *   Tag:
     *     type: object
     *     properties:
     *       title:
     *         type: string
     *       slug:
     *         type: string
     *       type:
     *         type: string
     */
};