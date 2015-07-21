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

    opts.selector = options.selector || 'form.json-rpc';
    opts.onSuccess = options.onSuccess || function () {
        window.alert('Request received successfully');
    };
    opts.onError = options.onError || function () {
        window.alert('There was an error with the request');
    };

    $(opts.selector).submit(function () {
        var $self = $(this),
            xhr = new XMLHttpRequest(),
            formData = new FormData(this);
        // form data and not jquery serialize
        // as form data is able to get the value set
        // by the clicked button
        xhr.addEventListener("load", opts.onSuccess);
        xhr.addEventListener("error", opts.onError);
        xhr.open("POST", $self.attr('action'));
        xhr.send(formData);

        return false;
    });
};