/*jslint node:true, nomen:true */
'use strict';

var path = require('path'),
    express = require('express');

module.exports = function (server) {
    var docroot = path.join(__dirname, '../../htdocs'),
        staticHandler = express['static'](docroot, {
            redirect: false
        });

    server.use(staticHandler);
};