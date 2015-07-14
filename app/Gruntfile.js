/*jslint node:true */
'use strict';

module.exports = function (grunt) {
    // Load the project's grunt tasks from a directory
    require('grunt-config-dir')(grunt, {
        configDir: require('path').resolve('tasks')
    });

    // Register group tasks
    grunt.registerTask('build', [
        'jslint',
        'sass',
        'browserify',
        'dustjs',
        'copyto',
        'shell:gruntCompact'
    ]);

    grunt.registerTask('compact', [
        'uglify',
        'cssmin'
    ]);

    grunt.registerTask('debug', [
        'supervisor',
        'sass',
        'browserify',
        'copyto',
        'watch:browserify',
        'watch:sass',
        'watch:templates'
    ]);

    grunt.registerTask('default', [
        'supervisor',
        'jslint',
        'sass',
        'browserify',
        'copyto',
        'watch'
    ]);
};