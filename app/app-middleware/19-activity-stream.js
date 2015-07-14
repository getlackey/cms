/*jslint node:true, nomen:true */
'use strict';

var activityStream = require('../models/activity-stream'),
    logger = require('../lib/logger');

module.exports = function (server) {
    server.use(function (req, res, next) {
        // hack. Saving a reference to the end function to 
        // use later on our fake end method we attached
        // to the res object
        var rEnd = res.end,
            tInit = +new Date();

        if (req.method === 'GET') {
            return next();
        }

        if (!res.user) {
            return next();
        }

        res.end = function (chunk, encoding) {
            var tEnd = +new Date();

            // Do the work expected
            res.end = rEnd;
            res.end(chunk, encoding);

            activityStream.create({
                author: res.user._id,
                method: req.method,
                url: req.originalUrl,
                headers: req.headers,
                body: req.body,
                response: {
                    status: res.statusCode,
                    body: (chunk && chunk.toString('utf8')) || '??',
                    duration: tEnd - tInit
                }
            }, function (err) {
                if (err) {
                    logger.error(err);
                }
            });
        };

        next();
    });
};