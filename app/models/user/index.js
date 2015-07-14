/*jslint node:true, nomen: true, unparam:true*/
'use strict';

var fs = require('fs'),
    path = require('path'),
    mongoose = require('mongoose'),
    version = require('lackey-mongoose-version'),
    acl = require('lackey-mongoose-acl'),
    dust = require('adaro'),
    config = require('config'),
    bcrypt = require('bcryptjs'),
    slugify = require('lackey-mongoose-slugify'),
    errors = require('common-errors'),
    logger = require('../../lib/logger'),
    dbs = require('../../lib/mongoose-connections'),
    mailTransporter = require('../../lib/mailer'),
    Schema = mongoose.Schema,
    schemaName = 'user',
    mongoSchema,
    Model;

mongoSchema = new Schema(require('./user-schema'));
mongoSchema.plugin(slugify, {
    source: 'email',
    logger: logger
});
mongoSchema.plugin(acl, {
    defaults: [],
    required: []
});
mongoSchema.plugin(version, {
    suppressVersionIncrement: false,
    collection: schemaName + '-versions',
    logError: true
});

// Populate DB if collection is empty
mongoSchema.on('init', function (Model) {
    var initData;

    Model
        .findOne({})
        .lean(true)
        .exec(function (err, doc) {
            if (!doc) {
                initData = require('./init-data.json');
                initData.forEach(function (item) {
                    Model.create(item, function (err, doc) {
                        if (err) {
                            logger.error('error on db init %s', err);
                        }
                        if (doc) {
                            logger.info('db init. Created item on %s', schemaName);
                        }
                    });
                });
            }
        });
});

mongoSchema.statics.get = function (data) {
    var self = this,
        promise = new mongoose.Promise(),
        password = data.password,
        email = data.email;

    self
        .findOne({
            email: email
        })
        .lean(true)
        .exec()
        .then(function (user) {
            if (!user) {
                return promise.error(new errors.AuthenticationRequiredError('invalid credentials'));
            }

            bcrypt.compare(password, user.passwordStrategy.password, function (err, isEqual) {
                if (err) {
                    return promise.error(err);
                }

                if (!isEqual) {
                    return promise.error(new errors.AuthenticationRequiredError('invalid credentials'));
                }

                promise.complete(user);
            });
        }, function (err) {
            promise.error(err);
        });

    return promise;
};

mongoSchema.pre('save', function (next) {
    var self = this;
    self.wasNew = self.isNew;

    // hash password
    // bcrypt hashes are 60 char long
    // but we're limiting passwords to 40
    if (self.passwordStrategy.password && self.passwordStrategy.password.length < 40) {
        bcrypt.hash(self.passwordStrategy.password, 10, function (err, hash) {
            if (err) {
                logger.error('Error encrypting user password %s', err);
                return next(err);
            }
            self.passwordStrategy.password = hash;
            next();
        });
    } else {
        return next();
    }
});

mongoSchema.post('save', function (user) {
    var self = this;

    if (self.wasNew) {
        fs.readFile(path.join(process.cwd(), '/views/_partials/account/email-register.dust'), 'utf8', function (err, template) {
            if (err) {
                logger.error('Error reading email-register template. %s', err);
            }

            dust.renderSource(template, {
                user: user,
                baseUrl: config.get('baseUrl')
            }, function (err, html) {
                if (err) {
                    logger.error('Error rendering email-register template. %s', err);
                }

                mailTransporter.sendMail({
                    from: config.get('mailer.from'),
                    to: user.email,
                    subject: 'Register account',
                    html: html
                }, function (err, info) {
                    if (err) {
                        logger.error('Error sending register email to %s', user.email, err, info);
                    } else {
                        logger.info('sent login-register-account mail to %s', user.email);
                        logger.debug(info);
                    }
                });
            });
        });
    }
});

Model = dbs.main.model(schemaName, mongoSchema);

module.exports = Model;