/*jslint node:true, unparam: true, nomen: true */
/*global describe, it, before, after */
'use strict';

var config = require('config'),
    assert = require("assert"),
    request = require('request');

describe('Tags', function () {
    var jwt;

    this.timeout(0);

    before(function (done) {
        var users = require('../../models/user/init-data.json');

        // authenticate user and get the JSON Web Token
        users.some(function (user) {
            if (user.group !== 'developer') {
                return false;
            }

            request.post({
                url: config.get('baseUrl') + '/sessions',
                json: {
                    email: user.email,
                    password: user.passwordStrategy.password
                }
            }, function (err, httpResponse, body) {
                assert.ifError(err);
                assert.equal(httpResponse.statusCode, 200, 'Unexpected status code.');

                jwt = body.token;

                done();
            });

            return true;
        });
    });

    describe('POST /tags', function () {
        it('Should create item', function (done) {
            var postData = {
                title: 'just a tag',
                type: 'universe'
            };

            request.post({
                url: config.get('baseUrl') + '/tags?jwt=' + jwt,
                json: postData
            }, function (err, httpResponse, body) {
                assert.ifError(err);
                assert.equal(httpResponse.statusCode, 200, 'Unexpected status code.');
                done();
            });
        });
    });
});