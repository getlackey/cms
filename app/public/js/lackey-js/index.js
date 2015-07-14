/*jslint node:true, browser:true */
'use strict';

require('./globals');

module.exports = {
    edit: require('./inline-edit'),
    cms: require('./cms'),
    views: require('./views')
};