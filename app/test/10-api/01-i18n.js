/*jslint node:true, unparam: true, nomen: true */
/*global describe, it, before, after */
'use strict';

var config = require('config'),
    assert = require("assert"),
    http = require('http');

describe('i18n', function () {
    this.timeout(0);

    describe('redirects', function () {
        it('should redirect /en/GB to /', function (done) {
            http.get(config.get('baseUrl') + '/en/GB', function (res) {
                assert.equal(res.statusCode, 302, 'Unexpected Status Code');
                assert.equal(res.headers.location, '/', 'Unexpected Location');
                done();
            }).on('error', function (e) {
                done(e);
            });
        });

        it('should redirect /en to /', function (done) {
            http.get(config.get('baseUrl') + '/en', function (res) {
                assert.equal(res.statusCode, 302, 'Unexpected Status Code');
                assert.equal(res.headers.location, '/', 'Unexpected Location');
                done();
            }).on('error', function (e) {
                done(e);
            });
        });
    });

    describe('default locale', function () {
        it('should use en_EN for /', function (done) {
            http.get(config.get('baseUrl') + '/', function (res) {
                assert.equal(res.statusCode, 200, 'Unexpected Status Code');
                assert.equal(res.headers['content-language'], 'en_GB', 'Unexpected Language');
                done();
            }).on('error', function (e) {
                done(e);
            });
        });

        it('should use en_EN for /js', function (done) {
            //even tough it matches the regex for a language it should be ignored
            http.get(config.get('baseUrl') + '/js', function (res) {
                assert.equal(res.headers['content-language'], 'en_GB', 'Unexpected Language');
                done();
            }).on('error', function (e) {
                done(e);
            });
        });

        it('should use en_EN for /js/DE', function (done) {
            //even tough it matches the regex for a locale it should be ignored
            http.get(config.get('baseUrl') + '/js/DE', function (res) {
                assert.equal(res.headers['content-language'], 'en_GB', 'Unexpected Language');
                done();
            }).on('error', function (e) {
                done(e);
            });
        });
    });
});