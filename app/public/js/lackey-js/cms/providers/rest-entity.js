/*jslint node:true, browser:true, unparam:true */
/*global angular */
'use strict';

var pluralize = require('pluralize');

module.exports = function (app) {
    app.provider('restEntity', function restEntityProvider() {
        var self = this;

        self.entityName = null;

        function restEntityFactory(Restangular, $http, $timeout, $sce) {
            var obj = {};

            obj.entityTitle = null;
            obj.entityName = self.entityName;
            obj.Entity = Restangular.all(self.entityName);

            obj.items = null;
            obj.opts = null;
            //obj.definitions = null;

            obj.fetch = function (skip) {
                var opts = obj.opts || {};

                if (!opts.limit) {
                    opts.limit = 30;
                }

                opts.skip = skip;

                obj.Entity.getList(opts).then(function (data) {
                    if (!data.length) {
                        return;
                    }

                    //append to items
                    data.forEach(function (item) {
                        obj.items.push(item);
                    });

                    skip += data.length;
                    setTimeout(function () {
                        obj.fetch(skip);
                    }, 100);
                });
            };

            // saves the items into arrItems
            obj.fetchItems = function (opts) {
                obj.items = [];
                obj.opts = opts;

                obj.fetch(0);

                return obj.items;
            };

            obj.setTitle = function ($scope, item) {
                obj.setTitle.$scope = $scope;
                obj.setTitle.item = item;
                // fetch definitions will set the title using this properties
            };

            obj.save = function (item, cb) {
                if (!cb) {
                    cb = function () {
                        return;
                    };
                }
                // update
                if (item.put) {
                    item.put().then(function (data) {
                        data.get()
                            .then(function (data) {
                                var index = obj.items.indexOf(item);
                                if (index > -1) {
                                    obj.items.splice(index, 1);
                                    $timeout(function () {
                                        obj.items.push(data);
                                        cb();
                                    });
                                }
                            });
                    }, function (err) {
                        var msg = 'An error occurred while saving (HTTP ' + err.status + ' - ' + err.statusText + ')';
                        if (err.data && err.data.message) {
                            msg += '<br/>' + err.data.message;
                        }
                        window.alert(msg);

                        cb();
                    });
                    return;
                }

                // create
                obj.Entity.post(item)
                    .then(function (data) {
                        data.get()
                            .then(function (data) {
                                obj.items.push(data);
                                cb();
                            });
                    }, function (err) {
                        window.alert('An error occurred while saving (HTTP ' + err.status + ' - ' + err.statusText + ')');

                        cb();
                    });
            };

            return obj;
        }

        self.$get = ['Restangular', '$http', '$timeout', '$sce', restEntityFactory];
    });
};