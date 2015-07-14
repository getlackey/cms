/*jslint node:true, unparam:true, regexp:true  */
'use strict';

var modRewrite = require('connect-modrewrite');

module.exports = function (server) {
    //hack: force CORS support
    server.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');

        next();
    });

    // We need a different path for the API
    // to prevent having only one response type 
    // cached by appcache or any proxy
    server.use(function (req, res, next) {
        var isHTML = /(.*).html?$/.test(req.path),
            isJSON = /(.*).json$/.test(req.path),
            isXlsx = /(.*).xlsx$/.test(req.path);

        // force accept and content type so it always handles with the mime type
        if (isHTML) {
            req.headers.accept = 'text/html,*/*;q=0.1';
            req.headers['content-type'] = 'text/html';
        } else if (isXlsx) {
            req.headers.accept = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,*/*;q=0.1';
            req.headers['content-type'] = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        } else if (isJSON) {
            req.headers.accept = 'application/json,*/*;q=0.1';
            req.headers['content-type'] = 'application/json';
        }

        next();
    });

    server.use(modRewrite([
        '(.*).json(\\?.*)?$ $1',
        '^(.*).xlsx(\\?.*)?$ $1',
        '^(.*).html?(\\?.*)?$ $1'
    ]));
};