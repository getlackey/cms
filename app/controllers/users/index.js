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
    errors = require('common-errors'),
    handler = require('lackey-request-handler'),
    mongooseUtils = require('lackey-mongoose-utils'),
    User = require('../../models/user'),
    auth = require('../../lib/auth'),
    baseUrl = config.get('baseUrl');

module.exports = function (router) {
    router.get('/',
        auth.isAny('admin developer'),
        handler(function (o) {
            User
                .find(o.find())
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
        auth.ensureLoggedIn(),
        handler(function (o) {
            User
                .findOne(o.getFilter('id:ObjectId(_id),slug'))
                .lean(true)
                .exec()
                .then(function (user) {
                    var canEdit = o.res.user.isAny('admin developer'),
                        isMe = o.res.user._id.toString() === user._id.toString();

                    return ((canEdit || isMe) ? user : null);
                })
                .then(o.formatOutput('_id:id *'))
                .then(o.handleOutput('html:user json'))
                .then(o.handle404(), o.handleError());
        }));

    router.post('/',
        auth.isAny('admin developer'),
        handler(function (o) {
            User
                .create(o.req.body)
                .then(o.formatOutput('_id:id'))
                .then(o.handleOutput())
                .then(o.handle404())
                .then(null, o.handleError());
        }));

    router.put('/:id',
        auth.ensureLoggedIn(),
        handler(function (o) {
            o.getBody()
                .then(function (doc) {
                    var redirectUrl = config.get('baseUrl') + '/users/' + o.req.params.id;

                    if (doc.passwordStrategy.password === '') {
                        delete doc.passwordStrategy;
                    }

                    if (doc.grants && typeof doc.grants === 'string') {
                        doc.grants = doc.grants.split(/, ?/);
                    }

                    User
                        .findOne(o.getFilter('id:ObjectId(_id),slug'))
                        .exec()
                        .then(o.handle404())
                        .then(function (user) {
                            var canEdit = o.res.user.isAny('admin developer'),
                                isMe = o.res.user._id.toString() === user._id.toString();

                            if (!canEdit && !isMe) {
                                throw new errors.HttpStatusError(403);
                            }
                            // white list properties
                            if (!canEdit) {
                                doc = {
                                    name: doc.name,
                                    email: doc.email,
                                    passwordStrategy: doc.passwordStrategy
                                };
                            }

                            return user;
                        })
                        .then(mongooseUtils.mergeData(doc))
                        .then(mongooseUtils.save)
                        .then(o.formatOutput('_id:id'))
                        .then(o.handleOutput('html:redirect(' + redirectUrl + ') json'))
                        .then(null, o.handleError());
                }, o.handleError());
        }));

    router['delete']('/:id',
        auth.isAny('admin developer'),
        handler(function (o) {
            User
                .findOne(o.getFilter('id:ObjectId(_id)'))
                .exec()
                .then(mongooseUtils.remove)
                .then(o.handleOutput())
                .then(o.handle404())
                .then(null, o.handleError());
        }));
};