/*jslint node:true, unparam: true, nomen: true */
/*global describe, it, before, after */
'use strict';

var config = require('config'),
    assert = require("assert"),
    request = require('request');

describe('Users', function () {
    this.timeout(0);

    describe('Sessions', function () {
        it('Should create new session', function (done) {
            var users = require('../../models/user/init-data.json');

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

                    done();
                });

                return true;
            });
        });

        it('Should return error with wrong credentials', function (done) {
            request.post({
                url: config.get('baseUrl') + '/sessions',
                json: {
                    email: 'error@dummy-domain.com',
                    password: 'qwerty1234'
                }
            }, function (err, httpResponse, body) {
                assert.ifError(err);
                assert.notEqual(httpResponse.statusCode, 200, 'Unexpected status code.');

                done();
            });
        });
    });
});