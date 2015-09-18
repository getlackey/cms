/*jslint node:true, nomen: true */
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
    jwt = require('jsonwebtoken'),
    Session = require('../../models/session'),
    handler = require('lackey-request-handler'),
    password = config.get('auth.password'),
    obj = {},
    Session;

function populateEnvVars(sessid, token, session, o) {
    session.sessid = sessid;
    o.res.user = session.user;
    if (!session.user.grants) {
        session.user.grants = [];
    }
    if (session.user.grants.indexOf(session.user.group) === -1) {
        session.user.grants.push(session.user.group);
    }
    o.res.locals.user = session.user;
    o.res.locals.jwt = token;

    o.res.session = session;
    o.res.locals.session = session;
}

// just checks. Allows anonymous users but some content may change for 
// the authenticated ones
obj.checkLoggedIn = function () {
    var self = this;

    return handler(function (o) {
        var token = self.getJwt(o.req),
            jwtPayload = jwt.decode(token);

        // if there is no jwt token or
        // if user was already loaded by some middleware
        if (!jwtPayload || o.res.user) {
            return o.next();
        }

        Session
            .get(jwtPayload.id)
            .then(function (session) {
                if (!session || !session.active || !session.user) {
                    o.res.clearCookie('jwt');
                    o.res.status(401); //.render('errors/401-expired');
                    o.handleOutput('html:errors/401-expired json')({
                        msg: 'Authentication Error - Expired'
                    });
                } else {
                    populateEnvVars(jwtPayload.id, token, session, o);
                    o.next();
                }
            }, function () {
                o.res.clearCookie('jwt');
                o.res.status(401);
                o.handleOutput('html:errors/401-expired json')({
                    msg: 'Authentication Error - Expired'
                });
            });
    });
};

// User needs to be logged in to get access 
obj.ensureLoggedIn = function () {
    var self = this;

    return handler(function (o) {
        var token = self.getJwt(o.req),
            jwtPayload = jwt.decode(token);

        if (!jwtPayload) {
            o.res.status(401);
            o.handleOutput('html:errors/401 json')({
                msg: 'Authentication Error',
                redirectUrl: o.req.originalUrl
            });
            return;
        }

        // if user was already loaded by some middleware
        if (o.res.user) {
            return o.next();
        }

        Session
            .get(jwtPayload.id)
            .then(function (session) {
                if (!session || !session.active || !session.user) {
                    o.res.clearCookie('jwt');
                    o.res.status(401);
                    o.handleOutput('html:errors/401-expired json')({
                        msg: 'Authentication Error - Expired',
                        redirectUrl: o.req.originalUrl
                    });
                } else {
                    populateEnvVars(jwtPayload.id, token, session, o);
                    o.next();
                }
            }, function (err) {
                o.next(err);
            });
    });
};

obj.callUserFunction = function (method, val) {
    var self = this,
        ensureLogin = self.ensureLoggedIn();

    return handler(function (o) {
        //function (req, res, next) {
        ensureLogin(o.req, o.res, function (err) {
            if (err) {
                o.next(err);
            }

            if (o.res.user && o.res.user[method] && o.res.user[method](val)) {
                o.next();
            } else {
                o.res.status(403);
                o.handleOutput('html:errors/403 json')({
                    msg: 'Authorization Error'
                });
            }
        });
    });
};

obj.is = function (group) {
    var self = this;
    return self.callUserFunction('is', group);
};

obj.isAny = function (group) {
    var self = this;
    return self.callUserFunction('isAny', group);
};

obj.signToken = function (data) {
    var obj = {};
    obj.payload = data;
    obj.token = jwt.sign(data, password);

    return obj;
};

obj.getJwt = function (req) {
    if (req.headers.authorization && (/^JWT /i).test(req.headers.authorization)) {
        return req.headers.authorization.replace(/^JWT /i, '');
    }
    if (req.query.jwt) {
        return req.query.jwt;
    }
    if (req.cookies && req.cookies.jwt) {
        return req.cookies.jwt;
    }
};

module.exports = obj;