/*jslint node:true */
'use strict';

module.exports = function jslint(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-jslint');

    // Options
    return {
        src: [
            'app-dustjs-helpers/**/*.js',
            'app-middleware/**/*.js',
            'controllers/**/*.js',
            'lib/**/*.js',
            'models/**/*.js',
            'public/js/**/*.js'
        ]
    };
};