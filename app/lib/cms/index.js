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

var pluralize = require('pluralize'),
    logger = require('../logger'),
    formData = require('lackey-form-data'),
    makeTitle = require('lackey-make-title'),
    optionsParser = require('lackey-options-parser'),
    cms = {
        items: []
    };

cms.register = function (obj) {
    var self = this;

    if (!obj || !obj.controller) {
        logger.error('invalid object properties in lib/cms');
    }

    if (!obj.columns) {
        obj.columns = 'title slug';
    } else {
        if (typeof obj.columns !== 'string') {
            obj.columns = optionsParser(obj.columns).toString();
        }
    }

    if (obj.hasLocale === undefined) {
        obj.hasLocale = true;
    }

    if (!obj.form) {
        obj.form = self.getForm(obj.controller);
    }

    self.items.push(obj);
};

cms.getForm = function (controller) {
    var entity = controller,
        Entity = require('../../models/' + pluralize.singular(entity));

    return {
        action: entity,
        items: formData().model(Entity).getRequired()
    };
};

cms.getData = function (controller) {
    var self = this,
        data = {},
        objDefs,
        definitionExists = false;

    definitionExists = self.items.some(function (item) {
        if (item.controller === controller) {
            objDefs = item;
            return true;
        }
        return false;
    });

    if (!definitionExists) {
        return null;
    }

    data.entity = controller;
    data.title = makeTitle(controller);
    data.form = objDefs.form;
    data.form.useAjax = true;
    data.columns = objDefs.columns;
    data.hasLocale = objDefs.hasLocale;

    return data;
};

module.exports = cms;