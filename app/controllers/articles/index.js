/*jslint node:true, unparam:true, nomen:true */
'use strict';

var config = require('config'),
    merge = require('merge'),
    Article = require('../../models/article'),
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
    controller: 'articles',
    columns: 'title locale author.email:Author createdAt'
});

/**
 * @swaggerTag
 * Article:
 *   description: Article
 */
module.exports = function (router) {
    /**
     * @SwaggerPath
     *   /articles:
     *     get:
     *       summary: Get list of Items
     *       description: Get list of articles
     *       tags:
     *         - Article
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
            Article
                .find(o.find())
                .setLocality(o.req.locality)
                .checkAcl(o.res.user)
                .select(o.select('title slug'))
                .sort(o.sort('-_id'))
                .limit(o.limit(10))
                .skip(o.skip())
                .lean(true)
                .exec()
                .then(o.formatOutput('_id:id *'))
                .then(o.handleOutput('html:articles json'))
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
     *         - Article
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
            Article
                .findOne(o.getFilter('id:ObjectId(_id),slug'))
                .lean(true)
                .exec()
                .then(Article.checkAcl(o.res.user))
                .then(o.formatOutput('_id:id *'))
                .then(o.handleOutput('html:articles/item json'))
                .then(o.handle404(), o.handleError());
        }));
    /**
     * @SwaggerPath
     *   /articles:
     *     post:
     *       summary: Create a new item
     *       tags:
     *         - Article
     *       parameters:
     *         - name: body
     *           in: body
     *           description: The item data. May be provided as a JSON body, an uploaded JSON file or as formData
     *           required: true
     *           schema:
     *             $ref: '#/definitions/Article'
     *       responses:
     *         200:
     *           description: OK
     */
    router.post('/',
        auth.isAny('admin developer'),
        handler(handlerOptions, function (o) {
            o.getBody().then(function (doc) {
                Article
                    .create(merge(doc, {
                        author: o.res.user
                    }))
                    .then(o.formatOutput('_id:id'))
                    .then(o.handleOutput())
                    .then(o.handle404(), o.handleError());
            });
        }));
    /**
     * @SwaggerPath
     *   /articles/{id}:
     *     put:
     *       summary: Update data for one item
     *       description: Several elements can be used as an unique identifier.
     *         You can use the ObjectId provided as **id** or the **slug**.
     *       tags:
     *         - Article
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
                    Article
                        .findOne(o.getFilter('id:ObjectId(_id)'))
                        .exec()
                        .then(o.handle404())
                        .then(mongooseUtils.update(merge(doc, {
                            author: o.res.user
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
     *         - Article
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
            Article
                .findOne(o.getFilter('id:ObjectId(_id)'))
                .exec()
                .then(mongooseUtils.remove)
                .then(o.handleOutput())
                .then(o.handle404(), o.handleError());
        }));
    /**
     * @SwaggerDefinitions
     *   Article:
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