/*jslint node:true, browser:true */
'use strict';

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