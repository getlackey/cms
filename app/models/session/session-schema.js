/*jslint node:true, nomen: true */
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports = {
    user: {
        _id: String,
        name: String,
        slug: String,
        email: String,
        group: String
    },
    active: {
        type: Boolean,
        'default': true
    },
    strategy: {
        type: String,
        'default': 'password' //options: password, recover-password
    },
    ttl: { //ms
        type: Number,
        'default': 0 // zero == infinite session
    }
};