/*jslint node:true, nomen:true */
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