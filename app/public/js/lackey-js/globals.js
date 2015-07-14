/*jslint node:true, browser:true, nomen:true */
'use strict';
var $ = window.jQuery,
    _ = window._,
    pathName = document.location.pathname;

require('foundation/js/vendor/fastclick');
require('foundation/js/vendor/jquery.cookie');
require('foundation/js/vendor/placeholder');

require('foundation');

require('angular');
require('ng-grid');
require('restangular');
require('angular-sanitize');
require('ng-file-upload');

//init foundation
$(document).foundation();