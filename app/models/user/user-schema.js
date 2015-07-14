/*jslint node:true, nomen: true, regexp:true  */
'use strict';

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