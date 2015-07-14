/*jslint node:true, nomen:true, unparam:true */
'use strict';

var config = require('config'),
    redirectRoutes = config.get('redirectRoutes');

module.exports = function (server) {
    server.use(function (req, res, next) {
        var url = req.url;

        redirectRoutes.forEach(function (rule) {
            var ruleParts = rule.split(' '),
                regex = new RegExp(ruleParts[0]);

            if (ruleParts.length !== 2) {
                throw new Error('Invalid Redirect Rule ' + rule);
            }

            if (regex.test(url)) {
                url = url.replace(regex, ruleParts[1]);
                return true;
            }
        });

        if (url !== req.url) {
            res.redirect(302, url);
        } else {
            next();
        }
    });
};