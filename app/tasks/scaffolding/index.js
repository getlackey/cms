/*jslint node: true, nomen:true */
'use strict';

var path = require('path'),
    fs = require('fs'),
    inquirer = require("inquirer"),
    mkdirp = require('mkdirp'),
    Q = require('q'),
    pluralize = require('pluralize');

module.exports = function scaffold(grunt) {

    function createModel(names) {
        var folderPath = 'models/' + names.singular,
            parseTemplates,
            saveFiles,
            promise;

        parseTemplates = function () {
            return Q.all([
                parseTpl('templates/model/index.tpl', names),
                parseTpl('templates/model/product-schema.tpl', names)
            ]);
        };


        saveFiles = function (files) {
            return Q.all([
                writeFile(folderPath + '/index.js', files[0]),
                writeFile(folderPath + '/' + names.singular + '-schema.js', files[1])
            ]);
        };

        promise = createDir(folderPath).then(parseTemplates).then(saveFiles);
        return promise;
    }

    function createViews(names) {
        var parseTemplates,
            saveFiles,
            promise;

        parseTemplates = function () {
            return Q.all([
                parseTpl('templates/views/singular.tpl', names),
                parseTpl('templates/views/plural.tpl', names)
            ]);
        };

        saveFiles = function (files) {
            return Q.all([
                writeFile('views/' + names.plural + '/' + names.singular + '.dust', files[0]),
                writeFile('views/' + names.plural + '/index.dust', files[1])
            ]);
        };

        promise = parseTemplates().then(saveFiles);

        return promise;
    }

    function createController(names) {
        var folderPath = 'controllers/' + names.plural,
            parseTemplate,
            saveFiles,
            promise;

        parseTemplate = function () {
            return parseTpl('templates/controller/index.tpl', names);
        };


        saveFiles = function (file) {
            return writeFile(folderPath + '/index.js', file);
        };

        promise = createDir(folderPath).then(parseTemplate).then(saveFiles);
        return promise;

    }

    function parseTpl(tplPath, names) {
        var deferred = Q.defer(),
            filePath = path.join(__dirname, tplPath),
            output = '';

        fs.readFile(filePath, 'utf8', function (err, text) {
            if (err) {
                return deferred.reject(err);
            }
            output = text;

            output = output.replace(/\$\$names.singular\$\$/g, names.singular);
            output = output.replace(/\$\$names.plural\$\$/g, names.plural);
            output = output.replace(/\$\$names.entity\$\$/g, names.entity);

            return deferred.resolve(output);
        });

        return deferred.promise;
    }

    function writeFile(filePath, content) {
        var deferred = Q.defer(),
            completeFilePath = path.join(__dirname, '../../', filePath);

        mkdirp(path.dirname(completeFilePath), function (err) {
            if (err) {
                return deferred.reject(err);
            }

            fs.writeFile(completeFilePath, content, function (err) {
                if (err) {
                    return deferred.reject(err);
                }
                deferred.resolve();
            });
        });

        return deferred.promise;
    }


    function createDir(dirPath) {
        var deferred = Q.defer(),
            completeDirPath = path.join(__dirname, '../../', dirPath);

        fs.mkdir(completeDirPath, function (err) {
            if (err) {
                return deferred.reject(err);
            }
            deferred.resolve();
        });

        return deferred.promise;
    }

    grunt.registerTask('scaffold', 'Code Scaffolding', function () {
        var done = this.async(),
            questions = [{
                type: "list",
                name: "component",
                message: "Which component do you need to create?",
                choices: [
                    'All',
                    'Model',
                    'Views',
                    'Controller'
                ]
            }, {
                type: "input",
                name: "name",
                message: "Name of the entity (singular please)?",
                validate: function (name) {
                    return (pluralize.singular(name) === name);
                }
            }];

        inquirer.prompt(questions, function (answers) {
            var names = {};

            grunt.log.write("Building ", answers.component, 'for', answers.name);

            // just a visual indicator we're doing something
            setInterval(function () {
                grunt.log.write('.');
            }, 500);


            names.singular = answers.name;
            names.plural = pluralize(answers.name);
            names.entity = names.singular.charAt(0).toUpperCase() + names.singular.slice(1); //uppercase first letter

            switch (answers.component) {
            case 'All':
                Q.all([
                    createModel(names),
                    createViews(names),
                    createController(names)
                ]).then(done, done);
                break;
            case 'Model':
                createModel(names).then(done, done);
                break;
            case 'Views':
                createViews(names).then(done, done);
                break;
            case 'Controller':
                createController(names).then(done, done);
                break;
            }
        });
    });

    return {};
};