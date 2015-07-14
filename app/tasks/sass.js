/*jslint node:true */
'use strict';

module.exports = function sass(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-sass');

    // Options
    return {
        build: {
            options: {
                style: 'compressed'
            },
            files: [{
                expand: true,
                cwd: 'public/css',
                src: ['**/*.scss'],
                dest: '../htdocs/css/',
                ext: '.css'
            }]
        }
    };
};