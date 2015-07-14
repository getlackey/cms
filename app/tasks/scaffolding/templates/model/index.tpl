/*jslint node:true, nomen: true */
'use strict';

var mongoose = require('mongoose'),
    version = require('mongoose-version'),
    timestamps = require('mongoose-timestamp'),
    slugHistory = require('../../lib/mongoose-slug-history'),
    uniqueSlug = require('../../lib/mongoose-unique-slug'),
    dbs = require('../../lib/mongoose-connections'),
    Schema = mongoose.Schema,
    schemaName = '$$names.singular$$',
    Model,
    mongoSchema;


mongoSchema = new Schema(require('./$$names.singular$$-schema'));

// there is a bug in this plugin. Will only work with a 
// single mongoose connection

// mongoSchema.plugin(version, {
//     maxVersions: 100,
//     strategy: 'array',
//     suppressVersionIncrement: false,
//     collection: schemaName + '-versions',
//     logError: true
// });

mongoSchema.plugin(timestamps);

mongoSchema.plugin(slugHistory, {
    name: schemaName
});

// clears the slug if provided. Otherwise, converts the title to a slug
// duplicated slugs will be suffixed by a random number
mongoSchema.plugin(uniqueSlug);

Model = dbs.main.model(schemaName, mongoSchema);
module.exports = Model;