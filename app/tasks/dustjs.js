/*jslint node:true */
'use strict';


module.exports = function dustjs(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-dustjs');

    // Options
    return {
        build: {
            files: [{
                expand: true,
                cwd: 'views/',
                src: '**/*.dust',
                dest: '../htdocs/views/dust',
                ext: '.js'
            }],
            options: {
                fullname: function (filepath) {
                    var name = filepath;
                    name = name.replace(/\.dust$/, '');
                    name = name.replace(/^views\//, '');
                    return name;
                }
            }
        }
    };
};