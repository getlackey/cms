/*jslint node:true, nomen: true */
'use strict';

module.exports = {
    title: String,
    slug: {
        type: String,
        unique: true
    },
    type: {
        type: String,
        index: true
    } // eg. universe. Types are rather loose, any keyword works
};