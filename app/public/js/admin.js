/*jslint node:true, browser:true, nomen:true */
'use strict';

var lackeyJs = require('./lackey-js'),
    jsonRPC = require('./json-rpc'),
    loadMore = require('./load-more'),
    $ = window.jQuery,
    appEdit,
    appCMS;

appEdit = lackeyJs.edit();
appCMS = lackeyJs.cms();

jsonRPC();
// hides load-more buttons if they will return 
// zero results
loadMore();

//hide lk-api buttons if no instance of lk-var was found
if ($('lk-var').length === 0) {
    $('lk-api').hide();
}