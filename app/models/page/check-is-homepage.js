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

module.exports = function (next) {
    var self = this,
        Model = self.model(self.constructor.modelName);

    if (!self.isHomePage) {
        return next();
    }

    if (self.parent) {
        // child pages can't be a homepage
        // no need to throw an error, let's just silently
        // change it back to false
        self.isHomePage = false;
        return next();
    }

    // reset isHomepage to false
    Model
        .update({
            isHomePage: true,
            groupId: {
                $ne: self.groupId
            }
        }, {
            $set: {
                isHomePage: false
            }
        }, {
            multi: true
        }, function (err) {
            if (err) {
                return next(err);
            }
            // update other translations in same group
            Model
                .update({
                    isHomePage: false,
                    groupId: self.groupId
                }, {
                    $set: {
                        isHomePage: true
                    }
                }, {
                    multi: true
                }, function (err) {
                    next(err);
                });
        });
};