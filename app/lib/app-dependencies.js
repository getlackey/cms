/*jslint node:true, nomen: true */
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

var path = require('path'),
    fs = require('fs');

function readFiles(pathName, cb, syncMode) {
    function processFiles(err, files) {
        var fileNames = [];
        if (err) {
            return cb(err);
        }
        fileNames = files
            .sort()
            .map(function (fileName) {
                if (fileName.charAt(0) === '.') { // ignore hidden files
                    return;
                }
                if (!/\.js$/.test(fileName)) { //only accept js files
                    return;
                }
                return fileName;
            })
            .filter(function (fileName) {
                return !!fileName;
            });

        cb(null, fileNames);
    }

    if (syncMode) {
        /*jslint stupid:true */
        // we need to use the sync method to read the config 
        // otherwise the models will try to use a connection
        // before it is started
        processFiles(null, fs.readdirSync(pathName));
    } else {
        fs.readdir(pathName, processFiles);
    }
}

module.exports.set = function (data, pathName, cb, syncMode) {
    var objs = [];

    readFiles(pathName, function (err, files) {
        if (err) {
            if (cb && cb.length > 0) { //the user is listening to the error
                return cb(err);
            }
            if (err) {
                throw err;
            }
        }
        objs = files.map(function (fileName) {
            var obj = require(path.join(pathName, fileName));
            if (obj) {
                obj(data);
            }
        });

        if (cb) {
            cb(null, objs);
        }
    }, syncMode);
};