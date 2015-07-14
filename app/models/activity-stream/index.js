/*jslint node:true, nomen: true */
'use strict';

var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp'),
    dbs = require('../../lib/mongoose-connections'),
    acl = require('lackey-mongoose-acl'),
    Schema = mongoose.Schema,
    schemaName = 'activity-stream',
    Model,
    mongoSchema;

mongoSchema = new Schema(require('./activity-stream-schema'));

mongoSchema.plugin(timestamps);
mongoSchema.plugin(acl, {
    defaults: [],
    required: ['admin', 'developer']
});

Model = dbs.main.model(schemaName, mongoSchema);
module.exports = Model;