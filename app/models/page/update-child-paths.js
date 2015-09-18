/*jslint node:true, nomen: true */
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
var path = require('path'),
    logger = require('../../lib/logger');

module.exports = function (self) {
    var now = new Date(),
        Model = require('../page');

    Model
        .find({
            parent: self._id
        })
        .exec()
        .then(function (docs) {
            if (!docs) {
                return docs;
            }

            docs.forEach(function (doc) {
                doc.updatedAt = now;
                doc.save(function (err) {
                    if (err) {
                        logger.error(err);
                    }
                });
            });
        })
        .then(null, function (err) {
            logger.error(err);
        });
};