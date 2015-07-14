/*jslint node:true */
'use strict';

var cfg = {};

cfg.mongodb = {
    connections: [{
        name: "main",
        connectionString: "mongodb://localhost:17017/lackey-cms-test"
    }]
};

module.exports = cfg;