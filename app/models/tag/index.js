/*jslint node:true, nomen: true */
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