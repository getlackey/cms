/*jslint node:true, nomen: true */
'use strict';

var mongoose = require('mongoose'),
    version = require('lackey-mongoose-version'),
    timestamps = require('mongoose-timestamp'),
    acl = require('lackey-mongoose-acl'),
    slugify = require('lackey-mongoose-slugify'),
    ensureObjectIds = require('lackey-mongoose-ensure-object-ids'),
    mongooseRefValidator = require('lackey-mongoose-ref-validator'),
    dbs = require('../../lib/mongoose-connections'),
    logger = require('../../lib/logger'),
    Schema = mongoose.Schema,
    schemaName = '$$names.singular$$',
    Model,
    mongoSchema;


mongoSchema = new Schema(require('./$$names.singular$$-schema'));

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
mongoSchema.plugin(ensureObjectIds, {
    'tag': 'slug ids'
});

Model = dbs.main.model(schemaName, mongoSchema);

module.exports = Model;