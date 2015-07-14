/*jslint node:true, browser:true */
'use strict';

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