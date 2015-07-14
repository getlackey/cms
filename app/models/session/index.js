/*jslint node:true, nomen: true */
'use strict';

var fs = require('fs'),
    path = require('path'),
    mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp'),
    acl = require('lackey-mongoose-acl'),
    config = require('config'),
    dust = require('dustjs-linkedin'),
    dbs = require('../../lib/mongoose-connections'),
    logger = require('../../lib/logger'),
    mailTransporter = require('../../lib/mailer'),
    userObj = require('./user-obj'),
    Schema = mongoose.Schema,
    schemaName = 'session',
    mongoSchema,
    Model;

mongoSchema = new Schema(require('./session-schema'));

mongoSchema.index({
    user: 1,
    active: 1
}, {
    unique: false
});

mongoSchema.plugin(timestamps);
mongoSchema.plugin(acl, {
    defaults: [],
    addAuthor: true,
    authorIdField: 'user._id',
    required: ['admin', 'developer']
});

mongoSchema.statics.get = function (sessid) {
    var self = this,
        promise = new mongoose.Promise();

    self
        .findOne({
            _id: sessid
        })
        .lean(true)
        .exec()
        .then(function (session) {
            if (!session) {
                return promise.complete(session);
            }

            //check if session is still valid
            if (session.ttl > 0) {
                if (+new Date(session._id.getTimestamp()) + session.ttl < +new Date()) {
                    return promise.complete({}); //expired session
                }
            }

            session.user = userObj(session.user);
            promise.complete(session);
        }, function (err) {
            promise.error(err);
        });

    return promise;
};

mongoSchema.statics.disableExpired = function () {
    var self = this,
        stream;

    stream = self
        .find({
            ttl: {
                $gt: 0
            },
            active: true
        })
        .stream();

    stream.on('data', function (doc) {
        var that = this;
        if (+new Date(doc._id.getTimestamp()) + doc.ttl <= +new Date()) {
            that.pause();

            doc.active = false;
            doc.save(function (err) {
                if (err) {
                    throw err;
                }
                that.resume();
            });
        }
    });

    stream.on('error', function (err) {
        throw err;
    });
};


mongoSchema.pre('save', function (next) {
    var self = this;

    self.wasNew = self.isNew;
    next();
});

mongoSchema.post('save', function (session) {
    var self = this,
        User = require('../user'); // require here to prevent cyclic dependencies

    if (!self.wasNew || session.strategy !== 'recover-password') {
        return;
    }

    User
        .findOne({
            _id: session.user._id
        })
        .exec()
        .then(function (user) {
            fs.readFile(path.join(process.cwd(), '/views/_partials/account/email-recover.dust'), 'utf8', function (err, template) {
                if (err) {
                    console.error(err);
                }

                dust.renderSource(template, {
                    user: user,
                    recoverUrl: config.get('baseUrl') + '/recover-sessions/' + session._id
                }, function (err, html) {
                    if (err) {
                        console.error(err);
                    }

                    mailTransporter.sendMail({
                        from: config.get('mailer.from'),
                        to: user.email,
                        subject: 'Reset Password',
                        html: html
                    }, function (err, info) {
                        if (err) {
                            logger.error('Error sending recover email to %s', user.email, err, info);
                        } else {
                            logger.info('sent login-recover-account mail to %s', user.email);
                            logger.debug(info);
                        }
                    });
                });
            });
        });
});

Model = dbs.main.model(schemaName, mongoSchema);

// Cleaning up the database sessions. Not really relevant if the
// session is disabled on the exact time it expires.
// Just make sure the interval is big enough so we won't
// have to check if we have multiple functions cleaning the 
// database at once
setInterval(function () {
    Model.disableExpired();
}, 1000 * 60 * 15); //every 15 min

module.exports = Model;