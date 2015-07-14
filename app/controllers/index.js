/*jslint node:true, unparam:true, nomen:true */
'use strict';

var fs = require('fs'),
    path = require('path'),
    handler = require('lackey-request-handler');

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
    return true;
};