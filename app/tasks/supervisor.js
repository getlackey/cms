/*jslint node:true */
'use strict';

module.exports = function supervisor(grunt) {
    grunt.loadNpmTasks('grunt-supervisor');

    return {
        target: {
            script: 'index.js',
            options: {
                ignore: ['node_modules'],
                forceSync: true
            }
        }
    };
};