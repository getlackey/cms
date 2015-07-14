/*jslint node:true, browser:true, nomen:true */
'use strict';

var $;

if (window._ === undefined) {
    window._ = require('lodash');
}

if (window.jQuery === undefined) {
    $ = require('jquery');
    window.jQuery = $;
    window.$ = $;
}