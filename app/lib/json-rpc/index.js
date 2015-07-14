/*jslint node:true, nomen:true, unparam: true */
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

//http://www.jsonrpc.org/specification

var assert = require('assert'),
    rpc,
    error;

error = function (code, message, data) {
    return {
        code: code,
        message: message || 'Undefined Error',
        data: data
    };
};
error.parseError = function (message, data) {
    return error(-32700, message || 'Parse error', data);
};
error.invalidRequest = function (message, data) {
    return error(-32600, message || 'Invalid Request', data);
};
error.methodNotFound = function (message, data) {
    return error(-32601, message || 'Method not found', data);
};
error.invalidParams = function (message, data) {
    return error(-32602, message || 'Invalid params', data);
};
error.internalError = function (message, data) {
    return error(-32603, message || 'Internal error', data);
};
// error.serverError = function (message, data) {
//     return error(-32000 to -32099, message || 'Server error', data);
// };

rpc = function (methods) {
    var fn;

    fn = function (req, res, next) {
        var body = req.body,
            methodName = body.method,
            params = body.params,
            id = body.id,
            method,
            cb;

        if (!body.jsonrpc) {
            return next();
        }

        if (!id) {
            // notification
            res.status(204).end();

            cb = function () {
                //ignore method response
                return true;
            };
        } else {
            cb = function (error, result) {
                var obj = {
                    jsonrpc: '2.0',
                    id: id
                };

                if (error) {
                    obj.error = error;

                    if (error.code === -32600) {
                        res.status(400);
                    } else if (error.code === -32601) {
                        res.status(404);
                    } else {
                        res.status(500);
                    }
                } else {
                    obj.result = result;
                }

                res.json(obj);
            };
        }

        assert.equal(body.jsonrpc, '2.0', 'Invalid protocol version');
        assert(methods.hasOwnProperty(methodName), 'Invalid method');

        method = methods[methodName];
        method(params, cb);
    };

    return fn;
};

rpc.error = error;

module.exports = rpc;