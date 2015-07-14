/*jslint node:true */
'use strict';

module.exports = function (server) {
    //set Language
    server.use(function (req, res, next) {
        var isCMS = /^\/cms\//.test(req.originalUrl),
            isEdit = false;

        if (res.user && res.user.isAny('admin developer')) {
            isEdit = !isCMS;
        } else {
            return next();
        }

        res.locals.isEdit = isEdit;
        res.locals.isCMS = isCMS;

        next();
    });
};