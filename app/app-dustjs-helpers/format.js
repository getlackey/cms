/*jslint node:true, unparam:true*/
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

// http://formatjs.io/dust/
// http://formatjs.io/guides/runtime-environments/#server
if (!global.Intl) {
    // No `Intl`, so use and load the polyfill.
    global.Intl = require('intl');
}

var DustIntl = require('dust-intl');

module.exports = function (dust) {
    if (!dust) {
        throw new Error('Parameter "dust" is not defined.');
    }

    dust.helpers = dust.helpers || {};

    DustIntl.registerWith(dust);
};