/*jslint node:true, nomen: true */
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports = {
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true
    }
};