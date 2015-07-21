/*jslint node:true, browser:true */
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

var $ = window.jQuery || require('jquery');

module.exports = function (options) {
    var opts = {};

    if (!options) {
        options = {};
    }

    opts.selector = options.selector || 'a.load-more';

    $(opts.selector).each(function () {
        var $self = $(this),
            href = $self.attr('href');

        if (!href) {
            return;
        }

        href = href.replace(/limit=[0-9]+/, 'limit=1');
        href = href.replace(/\.html?\?/, '.json?');

        $.getJSON(href, function (data) {
            console.log('data', arguments);

            if (!data || data.length === 0) {
                $self.remove();
            }
        });

        return false;
    });
};