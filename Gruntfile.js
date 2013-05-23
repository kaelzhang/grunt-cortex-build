/*
 * grunt-cortex-build
 * https://github.com/kaelzhang/grunt-cortex-build
 *
 * Copyright (c) 2013 Kael
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>',
            ],
            options: require('./.jshintrc.js'),
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['test/**/build'],
        },

        // Configuration to be run (and then tested).
        cortex_build: {
            normal: {
                options: {
                    cwd: 'test/normal'
                }
            },
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js'],
        },

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    // grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    // grunt.loadNpmTasks('grunt-contrib-nodeunit');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', [ /* 'clean',*/ 'cortex_build' /*, 'nodeunit' */]);

    // By default, lint and run all tests.
    grunt.registerTask('default', [ /*'jshint'*/'test']);

};
