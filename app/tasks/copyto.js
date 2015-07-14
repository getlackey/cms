/*jslint node:true */
'use strict';


module.exports = function copyto(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-copy-to');

    // Options
    return {
        build: {
            files: [{
                cwd: 'public',
                src: ['**/*'],
                dest: '../htdocs/'
            }],
            options: {
                ignore: [
                    'public/css/**/*.scss',
                    'public/js/**/*'
                ]
            }
        }
    };
};