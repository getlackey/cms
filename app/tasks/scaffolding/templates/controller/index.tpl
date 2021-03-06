/*jslint node:true, nomen:true */
'use strict';

var $$names.entity$$ = require('../../models/$$names.singular$$'),
    handler = require('lackey-request-handler'),
    auth = require('../../lib/auth'),
    cms = require('../../lib/cms');

cms.register({
    controller: '$$names.plural$$',
    columns: 'title slug createdAt'
});

/**
 * @swagger
 * resourcePath: /$$names.plural$$
 * description: Manage $$names.plural$$
 */
module.exports = function (router) {
    /**
     * @swagger
     * path: /$$names.plural$$
     * operations:
     *   - httpMethod: GET
     *     summary: List all items
     *     notes: List all items
     *     nickname: $$names.plural$$GET
     *     type: array
     *     items:
     *       $ref: $$names.entity$$
     *     produces:
     *       - application/json
     *     responseMessages:
     *       - code: 200
     *         message: OK
     */
    router.get('/',
        auth.isAny('admin developer'),
        handler(function (o) {
            $$names.entity$$
                .find(o.filter())
                .select(o.select())
                .sort(o.sort('-id'))
                .limit(o.limit(20))
                .skip(o.skip())
                .lean(true)
                .exec()
                .then(o.formatOutput('_id:id *'))
                .then(o.handleOutput('html:$$names.plural$$ json'))
                .then(o.handle404())
                .then(null, o.handleError());
        }));

    /**
     * @swagger
     * path: /$$names.plural$$/{id}
     * operations:
     *   - httpMethod: GET
     *     summary: Get single item
     *     notes: Shows data from a single item.
     *     nickname: $$names.plural$$GetOne
     *     type: $$names.entity$$
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: Payment method ID
     *         required: true
     *         type: string
     *         paramType: path
     *         allowMultiple: false
     *     responseMessages:
     *       - code: 200
     *         message: OK
     *       - code: 400
     *         message: Invalid ID format
     *       - code: 404
     *         message: $$names.entity$$ not found
     */
    router.get('/:id',
        auth.isAny('admin developer'),
        handler(function (o) {
            $$names.entity$$
                .findOne(o.getFilter())
                .lean(true)
                .exec()
                .then(o.formatOutput('_id:id *'))
                .then(o.handleOutput('html:$$names.singular$$ json'))
                .then(o.handle404())
                .then(null, o.handleError());
        }));

    /**
     * @swagger
     * path: /$$names.plural$$
     * operations:
     *   - httpMethod: POST
     *     summary: Create a new item
     *     notes: Creates a new item
     *     nickname: $$names.plural$$Post
     *     type: $$names.entity$$
     *     consumes:
     *       - application/json
     *       - application/x-www-form-urlencoded
     *     parameters:
     *       - name: body
     *         description: Document to insert
     *         required: true
     *         type: $$names.entity$$
     *         paramType: body
     *         allowMultiple: false
     *     responseMessages:
     *       - code: 200
     *         message: Item created. Returns the ID of the created item.
     *       - code: 400
     *         message: Invalid data supplied. Please check model validations.
     *       - code: 409
     *         message: Database conflict.
     */
    router.post('/',
        auth.isAny('admin developer'),
        handler(function (o) {
            o.getBody().then(function (doc) {
                $$names.entity$$
                    .create(doc)
                    .then(o.formatOutput('_id:id'))
                    .then(o.handleOutput('html:$$names.plural$$ json'))
                    .then(o.handle404())
                    .then(null, o.handleError());
            });
        }));

    /**
     * @swagger
     * path: /components
     * operations:
     *   - httpMethod: DELETE
     *     summary: Delete all items
     *     notes: Deletes all items
     *     nickname: $$names.plural$$DeleteAll
     *     type: $$names.entity$$
     *     consumes:
     *       - application/json
     *       - application/x-www-form-urlencoded
     *     responseMessages:
     *       - code: 200
     *         message: Items deleted
     *       - code: 404
     *         message: $$names.entity$$ not found
     */
    router['delete']('/',
        auth.isAny('admin developer'),
        handler(function (o) {
            $$names.entity$$
                .remove()
                .exec()
                .then(o.handleOutput('_id:id'))
                .then(o.handle404())
                .then(null, o.handleError());
        }));

    /**
     * @swagger
     * path: /$$names.plural$$/{id}
     * operations:
     *   - httpMethod: PUT
     *     summary: Update an item
     *     notes: Updates an item.
     *     nickname: $$names.plural$$Put
     *     type: $$names.entity$$
     *     consumes:
     *       - application/json
     *       - application/x-www-form-urlencoded
     *     parameters:
     *       - name: ID
     *         description: $$names.entity$$ ID
     *         required: true
     *         type: string
     *         paramType: path
     *         allowMultiple: false
     *       - name: body
     *         description: Payment method item
     *         required: true
     *         type: $$names.entity$$
     *         paramType: body
     *         allowMultiple: false
     *     responseMessages:
     *       - code: 200
     *         message: Item updated
     *       - code: 400
     *         message: Invalid ID format
     *       - code: 404
     *         message: $$names.entity$$ not found
     */

    router.put('/:id',
        auth.isAny('admin developer'),
        handler(function (o, m) {
            o.getBody().then(function (doc) {
                $$names.entity$$
                    .findOne(o.getFilter())
                    .exec()
                    .then(m.mergeData(doc))
                    .then(m.save)
                    .then(o.formatOutput('_id:id'))
                    .then(o.handleOutput())
                    .then(o.handle404())
                    .then(null, o.handleError());
            });
        }));

    /**
     * @swagger
     * path: /$$names.plural$$/{id}
     * operations:
     *   - httpMethod: DELETE
     *     summary: Delete an item
     *     notes: Deletes an item
     *     nickname: $$names.plural$$Delete
     *     type: $$names.entity$$
     *     consumes:
     *       - application/json
     *       - application/x-www-form-urlencoded
     *     parameters:
     *       - name: ID
     *         description: $$names.entity$$ ID
     *         required: true
     *         type: string
     *         paramType: path
     *         allowMultiple: false
     *     responseMessages:
     *       - code: 200
     *         message: Item deleted
     *       - code: 400
     *         message: Invalid ID format
     *       - code: 404
     *         message: Item not found
     */
    router['delete']('/:id',
        auth.isAny('admin developer'),
        handler(function (o, m) {
            $$names.entity$$
                .findOne(o.getFilter())
                .exec()
                .then(m.remove)
                .then(o.handleOutput())
                .then(o.handle404())
                .then(null, o.handleError());
        }));
    /**
     * @swagger
     * models:
     *   $$names.entity$$:
     *     id: $$names.entity$$
     *     title: $$names.entity$$
     *     description: Schema for one $$names.singular$$
     *     required:
     *       - title
     *     properties:
     *       title:
     *         type: String
     *         description: Title of $$names.singular$$
     *       slug:
     *         type: String
     *         description: Slug used in URLs
     */
};