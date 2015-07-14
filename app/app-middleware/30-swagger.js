/*jslint node:true, unparam:true, nomen:true */
'use strict';

var swaggerDocs = require('express-swagger-docs'),
    path = require('path'),
    routerFolder = path.join(__dirname, '..', '/controllers'),
    viewsFolder = path.join(__dirname, '..', '/views');

module.exports = function (server) {
    server.use(swaggerDocs({
        directory: routerFolder,
        templateFiles: false
    }));
};