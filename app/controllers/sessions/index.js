/*jslint node:true, nomen:true */
'use strict';
/*
    Copyright 2015 Enigma Marketing Services Limited

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/


var config = require('config'),
    Session = require('../../models/session'),
    User = require('../../models/user'),
    handler = require('lackey-request-handler'),
    mongooseUtils = require('lackey-mongoose-utils'),
    auth = require('../../lib/auth'),
    handlerOptions = {
        logger: require('../../lib/logger'),
        limit: 100,
        skip: 10000,
        sort: '_id title createdAt'
    };


module.exports = function (router) {
    router.get('/',
        handler(handlerOptions, function (o) {
            Session
                .find(o.find())
                .checkAcl(o.res.user)
                .select(o.select())
                .sort(o.sort('-_id'))
                .limit(o.limit(100))
                .skip(o.skip())
                .lean(true)
                .exec()
                .then(o.formatOutput('_id:id *'))
                .then(o.handleOutput())
                .then(o.handle404())
                .then(null, o.handleError());
        }));

    router.get('/:id',
        auth.isAny('api admin developer'),
        handler(handlerOptions, function (o) {
            Session
                .get(o.req.params.id)
                .then(o.formatOutput('_id:id *'))
                .then(o.handleOutput())
                .then(o.handle404())
                .then(null, o.handleError());
        }));

    router.post('/',
        handler(handlerOptions, function (o) {
            User
                .get(o.req.body)
                .then(function (user) {
                    var persistent = o.req.body.persistent,
                        ttl = persistent ? 0 : 1000 * 60 * 60 * 5; //5hrs

                    Session
                        .create({
                            user: user,
                            ttl: ttl,
                            strategy: 'password'
                        })
                        .then(mongooseUtils.lean(true))
                        .then(o.formatOutput('_id:id *'))
                        .then(auth.signToken)
                        .then(function (data) { // set cookie.
                            o.res.cookie('jwt', data.token, {
                                httpOnly: false,
                                maxAge: ttl || 1000 * 60 * 60 * 24 * 365 // 365 days
                            });
                            return data;
                        })
                        .then(o.handleOutput('html:redirect(' + config.get('baseUrl') + ') json'))
                        .then(o.handle404())
                        .then(null, o.handleError());
                })
                .then(null, o.handleError());
        }));

    router['delete']('/:id',
        auth.ensureLoggedIn(),
        handler(handlerOptions, function (o) {
            o.res.clearCookie('jwt');

            Session
                .findOne({
                    _id: o.req.params.id,
                    active: true
                })
                .exec()
                .then(function (session) {
                    session.active = false;
                    session.save(function (err) {
                        if (err) {
                            throw err;
                        }
                    });
                    return session;
                })
                .then(o.formatOutput('_id:id'))
                .then(o.handleOutput('html:redirect(' + config.get('baseUrl') + '/login) json'))
                .then(null, o.handleError());
        }));

    router['delete']('/',
        auth.isAny('api admin developer'),
        handler(handlerOptions, function (o) {
            var filter = o.find();
            if (!o.res.user.isAny('admin developer')) {
                filter.user = o.res.user._id;
            }

            o.res.clearCookie('jwt');

            Session
                .find(filter)
                .select(o.select())
                .sort(o.sort('-_id'))
                .limit(o.limit(100))
                .skip(o.skip())
                .exec()
                .then(function (sessions) {
                    // disabling all sessions, but returning early
                    sessions.forEach(function (session) {
                        session.active = false;
                        session.save(function (err) {
                            if (err) {
                                throw err;
                            }
                        });
                    });

                    return sessions;
                })
                .then(o.formatOutput('_id:id'))
                .then(o.handleOutput('html:redirect(' + config.get('baseUrl') + '/login) json'))
                .then(null, o.handleError());
        }));
};