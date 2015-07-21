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
    config = require('config'),
    optionsParser = require('lackey-options-parser'),
    locales = optionsParser(config.get('locales')),
    Schema = mongoose.Schema;

module.exports = {
    groupId: { // identifies the translations of the same article
        type: Schema.Types.ObjectId,
        index: true
    },
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String
    },
    locale: {
        type: String,
        required: true,
        'enum': locales.getKeys(),
        'default': config.get('defaultLocale')
    },
    author: {
        type: Schema.Types.Mixed
    },
    isPublished: {
        type: Boolean,
        'default': false
    },
    body: {
        type: Schema.Types.Mixed
    }
};