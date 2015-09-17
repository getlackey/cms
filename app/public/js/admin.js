/*jslint node:true, browser:true, nomen:true */
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

var lackeyJs = require('./lackey-js'),
    jsonRPC = require('./json-rpc'),
    loadMore = require('./load-more'),
    $ = window.jQuery,
    appEdit,
    appCMS;

appEdit = lackeyJs.edit();
require('./menu-management/controller.js')(appEdit);

appCMS = lackeyJs.cms();

jsonRPC();
// hides load-more buttons if they will return 
// zero results
loadMore();

//hide lk-api buttons if no instance of lk-var was found
if ($('lk-var').length === 0) {
    $('lk-api').hide();
}