/*jslint node:true, unparam: true, nomen: true */
/*global describe, it, before, after */
'use strict';

var config = require('config'),
    assert = require("assert"),
    http = require('http'),
    MongoClient = require('mongodb').MongoClient;

http.globalAgent.maxSockets = Infinity;

describe('Initialize tests', function () {
    this.timeout(0);

    before(function (done) {
        var connections;

        assert.equal(process.env.NODE_ENV, 'test', 'NODE_ENV must be "test" to preserve DB data');

        // disable http logger
        config.logger.level = 'none';

        if (!config.get('baseUrl')) {
            throw new Error('Missing config: baseUrl');
        }

        connections = config.get('mongodb.connections');
        MongoClient.connect(connections[0].connectionString, function (err, db) {
            assert.ifError(err);

            db.dropDatabase(function (err) {
                assert.ifError(err);
                db.close();
                // start the http server for this project
                require('../');
                // give some time to populate the DB with a user
                setTimeout(done, 1500);
            });
        });
    });

    describe('HTTP Server', function () {
        it('Should be running. GET /', function (done) {
            http.get(config.get('baseUrl'), function (res) {
                assert.equal(res.statusCode, 200, 'Unexpected Status Code');
                done();
            }).on('error', function (e) {
                done(e);
            });
        });
    });
});