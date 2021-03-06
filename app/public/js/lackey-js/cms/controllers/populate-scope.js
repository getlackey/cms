/*jslint node:true, browser:true, unparam:true */
/*global angular */
'use strict';

var optionsParser = require('lackey-options-parser');

module.exports = function ($scope, restEntity, $sce) {
    var elm,
        dataColumns;

    elm = document.getElementById('main-grid');
    dataColumns = optionsParser(elm.getAttribute('data-columns')).stripUnderscores().makeTitle();

    if (!elm) {
        throw new Error('unable to find grid container element with id main-grid');
    }

    $scope.data = {
        title: $sce.trustAsHtml('...')
    };
    restEntity.setTitle($scope, 'title');

    if ($scope.myColumns === undefined) {
        $scope.myColumns = [];

        Object.keys(dataColumns).forEach(function (key) {
            $scope.myColumns.push({
                field: key,
                displayName: dataColumns[key]
            });
        });

        //add actions
        $scope.myColumns.push({
            displayName: '',
            cellTemplate: 'views/ng-templates/ng-grid-actions.html',
            width: '100px'
        });
    }

    if ($scope.myData === undefined) {
        $scope.myData = restEntity.fetchItems({
            include: Object.keys(dataColumns).join(',')
        });
    }

    if ($scope.gridOptions === undefined) {
        $scope.gridOptions = {
            data: 'myData',
            enableColumnResize: true,
            enableColumnReordering: false,
            enableRowReordering: false,
            showFilter: true,
            columnDefs: 'myColumns',
            enableSorting: true,
            rowHeight: 40,
            headerRowHeight: 40
        };
    }

    if ($scope.deleteThisRow === undefined) {
        $scope.deleteThisRow = function (item) {
            var index = $scope.myData.indexOf(item),
                isConfirmed = window.confirm('Are you really sure you want to delete?');

            if (!isConfirmed) {
                return;
            }

            // remove from scope
            if (index > -1) {
                $scope.myData.splice(index, 1);
            }
            // remove from the REST service
            item.remove().then(function () {
                $scope.$emit('deletedItem');
            }, function (err) {
                window.alert('Unable to delete Item');
            });
        };
    }

    if ($scope.editThisRow === undefined) {
        $scope.editThisRow = function (item) {
            if (!item.slug && !item.id) {
                throw new Error('unable to find item\'s slug');
            }
            document.location = restEntity.entityName + '/' + (item.slug || item.id);
        };
    }

    $scope.formItem = {}; //item being created or edited
    $scope.showForm = false;

    $scope.toggleFormVisibility = function ($event) {
        if ($scope.showForm) {
            return $scope.resetForm($event);
        }
        $scope.showForm = true;
    };

    $scope.submitForm = function ($event) {
        restEntity.save($scope.formItem, function () {
            $scope.$emit('addedItem');
        });

        $scope.resetForm($event);
        $event.preventDefault();
    };

    $scope.resetForm = function ($event) {
        $scope.formItem = {};
        $scope.showForm = false;

        $event.preventDefault();
    };

    return $scope;
};