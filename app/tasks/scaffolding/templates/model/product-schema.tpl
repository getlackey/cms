/*jslint node:true, nomen: true */
'use strict';

module.exports = {
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    }
};