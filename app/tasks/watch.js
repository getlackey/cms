/*jslint node:true */
'use strict';

module.exports = function watch(grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');

    return {
        // watchify all build sub tasks 
        jslint: {
            files: ['public/js/**/*.js'],
            tasks: ['jslint']
        },
        browserify: {
            files: ['public/js/**/*.js'],
            tasks: ['browserify']
        },
        sass: {
            files: ['public/css/**/*.scss'],
            tasks: ['sass']
        },
        templates: {
            files: ['views/**/*.dust'],
            tasks: ['dustjs']
        }
    };
};