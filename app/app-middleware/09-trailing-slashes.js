/*jslint node:true, unparam:true */
'use strict';

var slashes = require("connect-slashes");

module.exports = function (server) {
    // remove trailing slashes from urls
    server.use(slashes(false));
};