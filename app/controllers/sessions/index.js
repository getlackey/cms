/*jslint node:true, nomen:true */
'use strict';

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