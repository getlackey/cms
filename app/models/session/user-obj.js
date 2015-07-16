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


// set of methods to check user group and permissions
module.exports = function (user) {
    var self = user;

    if (!user) {
        return user;
    }

    self.is = function (group) {
        return (user.group === group);
    };


    self.isAny = function (groups) {
        var listGroups = groups.split(' ');

        return (listGroups.indexOf(user.group) > -1);
    };

    return self;
};