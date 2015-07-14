/*jslint node:true, browser:true, unparam:true */
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

            // obj.fetchDefinitions = function () {
            //     obj.definitions = [];

            //     $http({
            //         method: 'GET',
            //         url: 'swagger-ui/api-docs.json/' + self.entityName
            //     }).success(function (data) {
            //         var modelName,
            //             properties;

            //         // get model name from the api methods.
            //         // we're looking for the POST on base path
            //         data.apis.some(function (api) {
            //             var apiPath = api.path;
            //             return api.operations.some(function (operation) {
            //                 if (operation.httpMethod === 'POST' && apiPath === '/' + obj.entityName) {
            //                     modelName = operation.type;
            //                     return true;
            //                 }
            //                 return false;
            //             });
            //         });

            //         // table column properties
            //         properties = data.models[modelName] && data.models[modelName].properties;
            //         if (properties) {
            //             //set page title
            //             if (data.models[modelName].title && obj.setTitle.item) {
            //                 obj.entityTitle = data.models[modelName].title || obj.entityName;
            //                 obj.setTitle.$scope.data[obj.setTitle.item] = $sce.trustAsHtml(obj.entityTitle);
            //             }

            //             Object.keys(properties).forEach(function (field) {
            //                 if (properties[field].label) {
            //                     obj.definitions.push({
            //                         field: field,
            //                         displayName: properties[field].label
            //                     });
            //                 }
            //             });

            //             if (obj.items) {
            //                 obj.fetch(0);
            //             }
            //             if (obj.definitions.length) {
            //                 obj.addActions();
            //             }
            //         }
            //     });

            //     return obj.definitions;
            // };

            // obj.addActions = function () {
            //     obj.definitions.push({
            //         displayName: '',
            //         cellTemplate: 'views/ng-templates/ng-grid-actions.html',
            //         width: '100px'
            //     });
            // };

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