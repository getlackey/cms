/*jslint node:true, nomen: true */
'use strict';

var mongoose = require('mongoose'),
    version = require('lackey-mongoose-version'),
    timestamps = require('mongoose-timestamp'),
    acl = require('lackey-mongoose-acl'),
    slugify = require('lackey-mongoose-slugify'),
    logger = require('../../lib/logger'),
    dbs = require('../../lib/mongoose-connections'),
    Schema = mongoose.Schema,
    schemaName = 'tag',
    Model,
    mongoSchema;

mongoSchema = new Schema(require('./tag-schema'));

mongoSchema.plugin(timestamps);
mongoSchema.plugin(acl, {
    required: ['admin', 'developer']
});
mongoSchema.plugin(slugify, {
    logger: logger
});
mongoSchema.plugin(version, {
    suppressVersionIncrement: false,
    collection: schemaName + '-versions',
    logError: true
});

Model = dbs.main.model(schemaName, mongoSchema);
module.exports = Model;