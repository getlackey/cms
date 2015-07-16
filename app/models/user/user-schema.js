/*jslint node:true, nomen: true, regexp:true  */
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


var optionsParser = require('lackey-options-parser'),
    groups = optionsParser('/models/user/groups.json'),
    groupKeys = groups.getKeys();

module.exports = {
    name: {
        type: String,
        required: true,
        label: 'Name'
    },
    email: {
        type: String,
        required: true,
        label: 'E-mail'
    },
    slug: {
        type: String,
        index: {
            unique: true,
            dropDups: true
        },
        label: 'Slug'
    },
    passwordStrategy: {
        password: {
            type: String,
            required: true,
            label: 'Password',
            match: [/.{8,40}/, 'Passwords must have a length between 8  and 40 characters']
        }
    },
    group: {
        type: String,
        'default': groupKeys[0],
        required: true,
        // groups are ordered. The ones with higher index have more abilities
        // changing the order changes the behaviour
        'enum': groupKeys
    },
    // Grant Groups/Permissions
    grants: [String]
};