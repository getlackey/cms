/*jslint node:true, nomen:true */
'use strict';

var path = require('path'),
    dustjs = require('adaro');

module.exports = function (server) {
    server.engine('dust', dustjs.dust({
        cache: false
    }));

    server.set('view engine', 'dust');
    server.set('views', path.join(__dirname, '..', 'views'));
};