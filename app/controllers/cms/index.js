/*jslint node:true, unparam:true, nomen:true */
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


var handler = require('lackey-request-handler'),
    formData = require('lackey-form-data'),
    auth = require('../../lib/auth'),
    cms = require('../../lib/cms');

module.exports = function (router) {
    // CRUD interface. Only some entities are allowed
    router.get('/users',
        auth.isAny('admin developer'),
        handler(function (o) {
            var Entity = require('../../models/user'),
                data = {
                    entity: 'users',
                    title: 'Users',
                    columns: 'name email group'
                };

            data.form = {
                action: 'users',
                items: formData().model(Entity).getRequired()
            };
            // split the group options to the ones that appear before
            // the logged in user group
            data.form.items.some(function (item) {
                var opts = [];
                if (item.name === 'group') {
                    item.options.some(function (option) {
                        opts.push(option);
                        return (option.label === o.res.user.group);
                    });
                    item.options = opts;
                }
            });

            o.handleOutput('html:cms json')(data);
        }));

    // generic loader
    router.get('/:entity',
        auth.isAny('admin developer'),
        handler(function (o) {
            var entity = o.req.params.entity,
                data;

            data = cms.getData(entity);

            if (!data) {
                return o.next();
            }
            o.handleOutput('html:cms json')(data);
        }));
};