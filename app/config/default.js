/*jslint node:true */
'use strict';

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

/*
    LOCALES

    We should use the following format:

        ["en_GB:English", "de_DE:German"]

    The first two letters are the language and should always be lower-case 
    and the following two the country, always upper-case. Both parts need to be
    defined according to http://en.wikipedia.org/wiki/Locale

    At this moment, we don't support encoding or modifiers.

    In case someone just provides the language and not the country we 
    will use the first locale from the list that has a matching language.
*/

// use lackey-options format
// https://www.npmjs.com/package/lackey-options-parser
cfg.locales = ["en_GB:English"];
cfg.defaultLocale = 'en_GB';

cfg.slugFormat = 'ascii'; //ascii, utf8

/*
    We need to create mappings for controller and template names. Data in the database
    (eg. articles) will be filtered by req.locality and slug.
*/
cfg.localisedRoutes = {};

/* 
    Issues a 302 redirect on these routes
    URLS shouldn't have spaces so it's safe to split the
    rewrite rule by space
*/
cfg.redirectRoutes = [
    '^/en/GB/?(.*) /$1',
    '^/en/?(.*) /$1'
];

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