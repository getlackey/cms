/*jslint node:true, unparam:true */
'use strict';

var methodOverride = require('method-override'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    multer = require('multer');

module.exports = function (server) {
    // reads the method from the querystring: ?_method=DELETE
    server.use(methodOverride('_method'));

    server.use(bodyParser.urlencoded({
        extended: true
    }));

    server.use(bodyParser.json());

    server.use(multer({
        dest: './uploads/'
    }));

    server.use(cookieParser());
};