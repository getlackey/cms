/*jslint node:true */
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


var cfg = {};

cfg.http = {
    port: process.env.PORT || 8000
};

cfg.baseUrl = 'http://127.0.0.1:8000';

cfg.logger = {
    level: 'info'
};

cfg.newRelic = {
    key: null
};
// E-mail is sent with nodemailler. Check the module
// for full configuration options:
// https://www.npmjs.com/package/nodemailer
cfg.mailer = {
    from: 'admin@enigma-marketing.co.uk',
    transport: null
    // AWS SES
    // transport: {
    //     host: "email-smtp.eu-west-1.amazonaws.com",// OR REPLACE WITH CORRECT REGION
    //     port: 465,
    //     secure: true,
    //     auth: {
    //         user: 'REPLACE WITH USERNAME',
    //         pass: 'REPLACE WITH PASSWORD'
    //     }
    // }
    // OR GMAIL
    // transport: {
    //     service: 'Gmail',
    //     auth: {
    //         user: 'REPLACE WITH USERNAME',
    //         pass: 'REPLACE WITH PASSWORD'
    //     }
    // }
    // OR.... check the module options
};

cfg.slugFormat = 'ascii'; //ascii, utf8

/*
    In the initial phases of a project being able to serve
    static dust.js templates as pages may speed the development process
    by not requiring a controller to be defined

                    DO NOT USE IN PRODUCTION

    Use the pages controller to define what template is used for each 
    route.
*/
cfg.serveStaticTemplates = true; // NOT PRODUCTION SAFE. Set as false.

cfg.mongodb = {
    connections: [{
        name: "main",
        connectionString: "mongodb://localhost:17017/lackey-cms"
    }]
};

cfg.auth = {
    // used to sign the JSON Web Token
    password: 'REPLACE WITH PASSWORD'
};


module.exports = cfg;