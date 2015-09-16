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
    errors = require('common-errors'),
    Media = require('../../models/media'),
    multer = require('multer'),
    mime = require('mime-types'),
    handler = require('lackey-request-handler'),
    mongooseUtils = require('lackey-mongoose-utils'),
    auth = require('../../lib/auth'),
    cms = require('../../lib/cms'),
    handlerOptions = {
        logger: require('../../lib/logger'),
        // NOTE: remember to keep doc/comments in sync
        limit: 100,
        skip: 10000,
        sort: '_id slug createdAt'
    },
    upload = multer({
        dest: 'uploads/media/',
        fileFilter: function (req, file, cb) {
            var acceptableFiles = [
                    '^image/',
                    '^application/(x-)?pdf',
                    '^application/zip'
                ],
                mimeType = file.mimetype,
                isAcceptable = false;

            isAcceptable = acceptableFiles.some(function (exp) {
                var regExp = new RegExp(exp, 'i');
                return regExp.test(mimeType);
            });

            cb(null, isAcceptable);
        }
    });

cms.register({
    controller: 'media',
    columns: 'url mimetype size createdAt',
    hasLocale: false
});

/**
 * @swaggerTag
 * Media:
 *   description: Media
 */
module.exports = function (router) {
    /**
     * @SwaggerPath
     *   /articles:
     *     get:
     *       summary: Get list of Items
     *       description: Get list of articles
     *       tags:
     *         - Media
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
            Media
                .find(o.find())
                .checkAcl(o.res.user)
                .select(o.select('title slug url mimetype createdAt'))
                .sort(o.sort('-_id'))
                .limit(o.limit(5))
                .skip(o.skip())
                .exec()
                .then(mongooseUtils.lean(true))
                .then(o.formatOutput('_id:id *'))
                .then(o.handleOutput())
                .then(o.handle404(), o.handleError());
        }));
    /**
     * @SwaggerPath
     *   /articles/{id}:
     *     get:
     *       summary: Get data for one item
     *       description: Several elements can be used as an unique identifier.
     *         You can use the ObjectId provided as **id** or the **slug**.
     *       tags:
     *         - Media
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
    // return the file
    router.get('/:id([a-z0-9-]+).:ext([a-z]{2,4})$',
        handler(handlerOptions, function (o) {
            Media
                .findOne(merge(o.getFilter('id:ObjectId(_id),slug'), {
                    mimetype: mime.lookup(o.req.params.ext)
                }))
                .lean(true)
                .exec()
                .then(Media.checkAcl(o.res.user))
                .then(function (doc) {
                    var source = path.join(__dirname, '..', '..', doc.path);
                    if (doc) {
                        o.res.sendFile(source, {
                            headers: {
                                'Content-Type': doc.mimetype
                            }
                        });
                    }

                    return doc;
                })
                .then(o.handle404(), o.handleError());
        }));
    // API endpoint, returns JSON
    router.get('/:id',
        handler(handlerOptions, function (o) {
            Media
                .findOne(o.getFilter('id:ObjectId(_id),slug'))
                .exec()
                .then(mongooseUtils.lean(true))
                .then(Media.checkAcl(o.res.user))
                .then(o.formatOutput('_id:id *'))
                .then(o.handleOutput('json'))
                .then(o.handle404(), o.handleError());
        }));
    /**
     * @SwaggerPath
     *   /articles:
     *     post:
     *       summary: Create a new item
     *       tags:
     *         - Media
     *       parameters:
     *         - name: body
     *           in: body
     *           description: The item data. May be provided as a JSON body, an uploaded JSON file or as formData
     *           required: true
     *           schema:
     *             $ref: '#/definitions/Media'
     *       responses:
     *         200:
     *           description: OK
     */
    router.post('/',
        auth.isAny('admin developer'),
        upload.single('file'),
        handler(handlerOptions, function (o) {
            var file = o.req.file,
                doc;

            if (!file) {
                throw new errors.HttpStatusError(400, "Missing or Invalid file");
            }

            doc = merge(file, {
                title: file.originalname.replace(/\.[a-z]{2,4}$/, ''),
                author: o.res.user && o.res.user._id
            });

            Media
                .create(doc)
                .then(o.formatOutput('_id:id url'))
                .then(o.handleOutput('html:redirect(' + config.get('baseUrl') + '/cms/media) json'))
                .then(o.handle404(), o.handleError());
        }));
    /**
     * @SwaggerPath
     *   /articles/{id}:
     *     put:
     *       summary: Update data for one item
     *       description: Several elements can be used as an unique identifier.
     *         You can use the ObjectId provided as **id** or the **slug**.
     *       tags:
     *         - Media
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
                    Media
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
     *   /articles/{id}:
     *     delete:
     *       summary: Delete one item
     *       description: Several elements can be used as an unique identifier.
     *         You can use the ObjectId provided as **id** or the **slug**.
     *       tags:
     *         - Media
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
            Media
                .findOne(o.getFilter('id:ObjectId(_id)'))
                .exec()
                .then(mongooseUtils.remove)
                .then(o.handleOutput())
                .then(o.handle404(), o.handleError());
        }));
    /**
     * @SwaggerDefinitions
     *   Media:
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