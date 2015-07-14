/*jslint node:true */
'use strict';

module.exports = function cssmin(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // Options
    return {
        styles: {
            options: {
                banner: '/*!*/\n\/*!\t[grunt] <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n/*!*/\n\n'
            },
            files: grunt.file.expandMapping('../htdocs/css/**/*.css', '../htdocs/css/', {
                flatten: true
            })
        }
    };
};