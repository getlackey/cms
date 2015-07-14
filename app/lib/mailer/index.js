/*jslint node:true, nomen:true, unparam:true */
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

var nodemailer = require('nodemailer'),
    clone = require('clone'),
    config = require('config'),
    transport = config.get('mailer.transport'),
    mailer;


if (transport) {
    mailer = nodemailer.createTransport(clone(transport));
} else {
    mailer = {
        sendMail: function (ignore, cb) {
            cb(new Error('Unable to send email. No transport was set in the config.'));
        }
    };
}

module.exports = mailer;