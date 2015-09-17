/*jslint node:true, unparam:true, nomen:true */
'use strict';

var config = require('config'),
    merge = require('merge'),
    Page = require('../../models/page'),
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
    };

cms.register({
    controller: 'pages',
    columns: 'title path createdAt'
});

/**
 * @swaggerTag
 * Page:
 *   description: Page
 */
module.exports = function (router) {
    /**
     * @SwaggerPath
     *   /pages:
     *     get:
     *       summary: Get list of Items
     *       description: Get list of pages
     *       tags:
     *         - Page
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
            Page
                .find(o.find())
                .checkAcl(o.res.user)
                .select(o.select('title slug path author'))
                .sort(o.sort('-_id'))
                .limit(o.limit(10))
                .skip(o.skip())
                .lean(true)
                .exec()
                .then(o.formatOutput('_id:id *'))
                .then(o.handleOutput('html:pages json'))
                .then(o.handle404(), o.handleError());
        }));
    /**
     * @SwaggerPath
     *   /pages/{id}:
     *     get:
     *       summary: Get data for one item
     *       description: Several elements can be used as an unique identifier.
     *         You can use the ObjectId provided as **id** or the **slug**.
     *       tags:
     *         - Page
     *       parameters:
     *         - name: id
     *           in: path
     *           description: The item Identifier (ObjectID or Path)
     *           required: true
     *           type: string
     *       responses:
     *         200:
     *           description: OK
     *         400:
     *           description: Invalid ID format
     */
    // Regex as pages can be searched by path including /
    router.get('/:id([a-z0-9A-Z-\/]*)',
        handler(handlerOptions, function (o) {
            Page
                .findOne(o.getFilter('id:ObjectId(_id),path'))
                .populate('tags', 'slug title')
                .lean(true)
                .exec()
                .then(Page.checkAcl(o.res.user))
                .then(o.formatOutput('_id:id *'))
                .then(o.handleOutput(function (doc) {
                    return 'html:pages/templates/' + doc.template + ' json';
                }))
                .then(o.handle404(), o.handleError());
        }));
    /**
     * @SwaggerPath
     *   /pages:
     *     post:
     *       summary: Create a new item
     *       tags:
     *         - Page
     *       parameters:
     *         - name: body
     *           in: body
     *           description: The item data. May be provided as a JSON body, an uploaded JSON file or as formData
     *           required: true
     *           schema:
     *             $ref: '#/definitions/Page'
     *       responses:
     *         200:
     *           description: OK
     */
    router.post('/',
        auth.isAny('admin developer'),
        handler(handlerOptions, function (o) {
            o.getBody()
                .then(Page.ensureObjectIds)
                .then(function (doc) {
                    Page
                        .create(merge(doc, {
                            author: o.res.user && o.res.user._id
                        }))
                        .then(o.formatOutput('_id:id'))
                        .then(o.handleOutput())
                        .then(o.handle404(), o.handleError());
                });
        }));
    /**
     * @SwaggerPath
     *   /pages/{id}:
     *     put:
     *       summary: Update data for one item
     *       description: Several elements can be used as an unique identifier.
     *         You can use the ObjectId provided as **id** or the **slug**.
     *       tags:
     *         - Page
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
                .then(Page.ensureObjectIds)
                .then(function (doc) {
                    Page
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
     *   /pages/{id}:
     *     delete:
     *       summary: Delete one item
     *       description: Several elements can be used as an unique identifier.
     *         You can use the ObjectId provided as **id** or the **slug**.
     *       tags:
     *         - Page
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
            Page
                .findOne(o.getFilter('id:ObjectId(_id)'))
                .exec()
                .then(mongooseUtils.remove)
                .then(o.handleOutput())
                .then(o.handle404(), o.handleError());
        }));
    /**
     * @SwaggerDefinitions
     *   Page:
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