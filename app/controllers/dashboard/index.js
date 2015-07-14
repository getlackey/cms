/*jslint node:true, unparam:true, nomen:true */
'use strict';

var Q = require('q'),
    mongoose = require('mongoose'),
    auth = require('../../lib/auth'),
    handler = require('lackey-request-handler'),
    handlerOptions = {
        logger: require('../../lib/logger')
    },
    errorsTtl = 1000 * 60 * 60 * 24 * 7;

module.exports = function (router) {
    router.get('/',
        auth.isAny('admin developer'),
        handler(handlerOptions, function (o) {
            o.res.render('dashboard');
        }));
};