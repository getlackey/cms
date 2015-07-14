/*jslint node:true, unparam:true, nomen:true */
'use strict';

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