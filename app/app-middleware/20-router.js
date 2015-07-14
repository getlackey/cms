/*jslint node:true, unparam:true */
'use strict';

var enrouten = require('express-enrouten');

module.exports = function (server) {
    server.use(enrouten({
        directory: '../controllers'
    }));
};