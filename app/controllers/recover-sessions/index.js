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
    auth = require('../../lib/auth');

module.exports = function (router) {
    router.get('/',
        auth.isAny('admin developer'),
        handler(function (o) {
            Session
                .find(o.find({
                    strategy: 'recover-password'
                }))
                .select(o.select())
                .sort(o.sort('-_id'))
                .limit(o.limit(100))
                .skip(o.skip())
                .populate('user', 'email')
                .lean(true)
                .exec()
                .then(o.formatOutput('_id:id *'))
                .then(o.handleOutput())
                .then(o.handle404())
                .then(null, o.handleError());
        }));


    router.get('/:id',
        // auth.checkLoggedIn(),
        handler(function (o) {
            Session
                .get(o.req.params.id)
                .then(o.formatOutput('_id:id *'))
                .then(function (session) {
                    return (session.strategy === 'recover-password' ? session : null);
                })
                .then(o.formatOutput('_id:id *'))
                .then(function (session) {
                    if (!session) {
                        return session;
                    }
                    // Lets set the session cookie and redirect
                    // so the user can update it's password
                    var uid = session.user._id.toString(),
                        handler = o.handleOutput('html:redirect(' + config.get('baseUrl') + '/users/' + uid + ') json'),
                        opts = {
                            //secure: true,
                            httpOnly: false
                        };
                    // couldn't find an easy way to check if request type is html
                    if (o.req.accepts(['html', 'json', 'xlsx']) === 'html') {
                        o.res.cookie('jwt', auth.signToken(session).token, opts);
                    }
                    handler(session);

                    return session;
                })
                .then(o.handle404())
                .then(null, o.handleError());
        }));


    router.post('/',
        handler(function (o) {
            User
                .findOne({
                    email: o.req.body.email
                })
                .lean(true)
                .exec()
                .then(function (user) {
                    var ttl = 1000 * 60 * 60 * 8; // 8hrs

                    if (!user) {
                        return;
                    }

                    Session
                        .create({
                            user: user,
                            ttl: ttl,
                            strategy: 'recover-password'
                        })
                        .then(function (doc) {
                            return ({
                                status: (doc ? 'created' : 'failled')
                            });
                        })
                        .then(o.handleOutput('html:redirect(' + config.get('baseUrl') + '/login?sentRecover=true) json'))
                        .then(o.handle404())
                        .then(null, o.handleError());

                    return user;
                })
                .then(o.handle404())
                .then(null, o.handleError());
        }));


    router['delete']('/:id',
        auth.ensureLoggedIn(),
        handler(function (o) {
            Session
                .findOne({
                    _id: o.req.params.id,
                    strategy: 'recover-password',
                    active: true
                })
                .exec()
                .then(mongooseUtils.remove)
                .then(function (doc) {
                    return ({
                        status: (doc ? 'deleted' : 'failled')
                    });
                })
                .then(o.handleOutput('html:redirect(' + config.get('baseUrl') + '/login) json'))
                .then(o.handle404())
                .then(null, o.handleError());
        }));
};