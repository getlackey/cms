/*jslint node:true, nomen:true */
'use strict';

var logger = require('express-bunyan-logger'),
    pkg = require('../package.json'),
    streams = require('../lib/logger/streams');

module.exports = function (server) {
    server.use(logger({
        name: 'HTTP ' + pkg.name,
        streams: streams
    }));
};