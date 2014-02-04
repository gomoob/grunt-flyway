/*
 * grunt-flyway
 * https://github.com/bgaillard/grunt-flyway
 *
 * Copyright (c) 2013 Baptiste Gaillard
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
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    flyway: {
        
        options: {
            driver : 'com.mysql.jdbc.Driver',
            initDescription : 'Sample database created using Flyway :-)',
            initVersion : '1.0',
            url : 'jdbc:mysql://localhost/flyway',
            user : 'flyway',
            password : 'flyway'
        },
        
        /*clean : {},*/

        init : {
            command : 'init'
        }/*,

        migrate: {
            options: {
                url : 'jdbc:mysql://localhost/flyway_test_db'
            },
            files: {},
        }*/
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  
  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'flyway', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
