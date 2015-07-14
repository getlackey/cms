/*jslint node:true, nomen:true */
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

var assert = require('assert'),
    fs = require('fs'),
    path = require('path'),
    Obj;

Obj = function (opts) {
    var self = this;

    assert(opts, 'Missing options object');
    assert(opts.db, 'Missing option db');
    assert(opts.tasksDir, 'Missing option tasksDir');

    self.db = opts.db;
    self.tasksDir = opts.tasksDir;

    // wait before issuing a warning about a missing next call
    self.timeout = +opts.timeout || 180000;
    // wait before next task call
    self.wait = +opts.wait || 5000;
    self.logger = opts.logger || console;

    self.tasks = [];
    self.taskIndex = 0;

    self.loadTasks();
};

Obj.prototype.loadTasks = function () {
    var self = this;
    fs.readdir(self.tasksDir, function (err, items) {
        assert.ifError(err);

        items.forEach(function (item) {
            var taskName = path.basename(item, path.extname(item)),
                task = require(path.join(self.tasksDir, taskName));

            if (self.tasks.indexOf(task) === -1) {
                self.tasks.push({
                    name: taskName,
                    exec: task
                });
            }
        });

        self.processNextTask();
    });
};

Obj.prototype.processNextTask = function () {
    var self = this,
        task = self.tasks[self.taskIndex],
        timeoutWarn;

    if (!task) {
        self.taskIndex = 0;

        return setTimeout(self.processNextTask.bind(self), self.wait);
    }

    timeoutWarn = setInterval(function () {
        self.logger.warn('Janitor: Still waiting for next call in task ' + task.name);
    }, self.timeout);

    task.exec({
        db: self.db
    }, function (err, msg) {
        if (err) {
            self.logger.error(err);
        }

        if (msg) {
            self.logger.info('Janitor: ' + msg);
        }

        self.taskIndex += 1;
        clearInterval(timeoutWarn);
        setTimeout(self.processNextTask.bind(self), self.wait);
    });
};

module.exports = Obj;