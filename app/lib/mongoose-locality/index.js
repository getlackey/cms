/*jslint node:true, nomen: true, unparam:true */
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

module.exports = function (schema, options) {
    schema.on('init', function (Model) {
        var modelFind = Model.find,
            modelFindOne = Model.findOne;
        // We are overwriting/extending the find method
        // we keep the reference to the old method in modelFind
        // and call it in our new find method
        Model.find = function (conditions, fields, options, callback) {
            var self = this,
                mq = modelFind.call(self, conditions, fields, options, callback);

            mq.setLocality = function (locality, cb) {
                var cond = mq._conditions;

                // allow the user to supply a custom find query
                // to set a locality different  than the one 
                // guessed from the URL.
                if (!cond.locale) {
                    cond.locale = locality.locale;
                }
                mq.find(cond, cb);

                return mq;
            };

            return mq;
        };

        Model.findOne = function (conditions, fields, opts, callback) {
            var self = this,
                mq = modelFindOne.call(self, conditions, fields, opts, callback);

            mq.setLocality = function (locality, cb) {
                var cond = mq._conditions;

                // allow the user to supply a custom find query
                // to set a locality different  than the one 
                // guessed from the URL.
                if (!cond.locale) {
                    cond.locale = locality.locale;
                }
                mq.findOne(cond, cb);

                return mq;
            };

            return mq;
        };
    });
};