/*jslint node:true, nomen: true */
'use strict';

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