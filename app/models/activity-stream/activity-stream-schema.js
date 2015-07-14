/*jslint node:true, nomen: true */
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports = {
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    method: String,
    url: String,
    headers: Schema.Types.Mixed,
    body: Schema.Types.Mixed,
    response: {
        status: Number,
        body: Schema.Types.Mixed,
        duration: Number // mseconds
    }
};