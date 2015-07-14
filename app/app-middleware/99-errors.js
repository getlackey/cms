/*jslint node:true, nomen:true, unparam:true */
'use strict';

var errors = require('common-errors'),
    handler = require('lackey-request-handler');

module.exports = function (server) {
    // If we got to this point there was no handler for this request
    server.use(function (req, res, next) {
        next(new errors.NotFoundError(req.originalUrl));
    });
    // Generic error handler.
    server.use(function (err, req, res, next) {
        if (!err) {
            return next();
        }

        (handler(function (o) {
            var errHandler = o.handleError();
            errHandler(err);
        })(req, res, next));
    });
    // Just in Case... Catch all!
    server.use(errors.middleware.crashProtector());
};