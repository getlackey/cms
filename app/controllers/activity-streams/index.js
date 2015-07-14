/*jslint node:true, nomen:true */
'use strict';

var ActivityStream = require('../../models/activity-stream'),
    handler = require('lackey-request-handler'),
    auth = require('../../lib/auth');

/**
 * @swaggerTag
 * activityStreams:
 *   description: All methods that change data (POST/PUT/DELETE) across the API are logged
 */
module.exports = function (router) {
    /**
     * @SwaggerPath
     *   /activity-streams:
     *     get:
     *       summary: Get the latest items
     *       tags:
     *         - activityStreams
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
     *         - activityStreams
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