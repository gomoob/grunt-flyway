/*
 * grunt-flyway
 * https://github.com/bgaillard/grunt-flyway
 *
 * Copyright (c) 2013 Baptiste Gaillard
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    var ChildProcess = require('child_process'),
        Util = require('util'),
        Os = require('os'),
        Path = require('path');

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks
    grunt.registerMultiTask('flyway', 'Your task description goes here.', function() {

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options();

        var done = this.async();

        // Path to the Flyway Command Line 'bin' directory
        var flywayBinPath = Path.resolve(__dirname, '../flyway-3.2.1/lib');

        // Windows CLASSPATH separator
        var classPathSeparator = ';';

        // Unix CLASSPATH separator
        if(Os.platform() === 'linux' || Os.platform() === 'darwin') {

            classPathSeparator = ':';

        }

        // Creates the Java CLASSPATH used to run Flyway
        var javaClasspath = flywayBinPath + '/flyway-commandline-3.2.1.jar' + classPathSeparator;
        javaClasspath = javaClasspath + flywayBinPath + '/flyway-core-3.2.1.jar';

        // Object used to configure the Flyway Commands which are available with the Grunt Flyway Plugin
        // Currently available commands are :
        // - clean      : Drops all objects in the configured schemas
        // - init       : Creates and initializes the metadata table
        // - migrate    : Migrates the database
        // - validate   : Validates the applied migrations against the ones available on the classpath
        //
        // The following commands are currently not available : 'info', 'repair'
        var availableCommands = {
            clean: {
                url: {
                    required: true
                },
                driver: {},
                user: {},
                password: {},
                schemas: {},
                jarDir: {}
            },
            init: {
                url: {
                    required: true
                },
                driver: {},
                user: {},
                password: {},
                schemas: {},
                table: {},
                jarDir: {},
                initVersion: {},
                initDescription: {}
            },
            migrate: {
                url: {
                    required: true
                },
                driver: {},
                user: {},
                password: {},
                schemas: {},
                table: {},
                locations: {},
                jarDir: {},
                sqlMigrationPrefix: {},
                sqlMigrationSuffix: {},
                encoding: {},
                placeholders: {
                    isObject: true
                },
                placeholderPrefix: {},
                placeholderSuffix: {},
                target: {},
                outOfOrder: {},
                validateOnMigrate: {},
                cleanOnValidationError: {},
                initOnMigrate: {},
                initVersion: {},
                initDescription: {}
            },
            validate: {
                url: {
                    required: true
                },
                driver: {},
                user: {},
                password: {},
                schemas: {},
                table: {},
                locations: {},
                jarDir: {},
                sqlMigrationPrefix: {},
                sqlMigrationSuffix: {},
                encoding: {},
                placeholders: {
                    isObject: true
                },
                placeholderPrefix: {},
                placeholderSuffix: {},
                target: {},
                outOfOrder: {},
                cleanOnValidationError: {}
            }
        };

        // Checks if the provided Flyway command name is valid (i.e supported by the Grunt Flyway Plugin)
        if(!availableCommands.hasOwnProperty(this.data.command)) {

            grunt.log.error(
                Util.format('Flyway does not provide any command named \'%s\' or this command is not currently supported by the Plugin !',
                    this.data.command));

            return done(false);

        }

        // Create the Console Command line used to execute the Flyway Command Line program
        var flywayCommand = 'java -cp ' + javaClasspath + ' org.flywaydb.commandline.Main ' + this.data.command;

        // Gets valid command line options associated to the Flyway Command which have been entered
        var commandOptions = availableCommands[this.data.command];

        // Checks if options which have been entered on command line are supported options
        for (var option in options) {

            if (options.hasOwnProperty(option) && !commandOptions.hasOwnProperty(option)) {

                grunt.log.error(Util.format('Flyway does not provide option \'%s\' for command named \'%s\'!',
                    option,
                    this.data.command));

                return done(false);

            }

        }

        // For each Flyway options associated to the Flyway Command which have been entered
        for (option in commandOptions) {

            // If the entered option is available and supported by the Grunt Flyway plugin
            if (options.hasOwnProperty(option)) {

                // Checks if the current options is a 'sub option'
                if (commandOptions[option].isObject) {

                    /*
                        Handling of object-type options. Currently it's only `placeholders`.

                        Configuration written as:
                        placeholders: {
                          name1: 'value1',
                          name2: 'value2'
                        }

                        is added to command string as:
                        -placeholders.name1="value1" -placeholders.name2="value2"
                     */

                    var parameter = null;

                    for(parameter in Object.keys(options[option])) {

                        flywayCommand += Util.format(' -%s.%s="%s"', option, parameter, options[option][parameter]);

                    }

                }

                // The current option is a standard option
                else {

                    flywayCommand += Util.format(' -%s="%s"', option, options[option]);

                }

            }

            // An option associated to the Flyway Command entered is not available of not supported by the Flyway Grunt
            // Plugin
            else if (commandOptions[option].required) {

                grunt.log.error(Util.format('Flyway requires option \'%s\' to be set for command named \'%s\'!',
                    option,
                    this.data.command));

                return done(false);

            }

        }

        grunt.log.write(flywayCommand);

        var childProcess = ChildProcess.exec(flywayCommand, function(error, stdout, stderr) {

            grunt.log.writeln();
            grunt.log.writeln(error);
            grunt.log.writeln(stdout);
            grunt.log.writeln(stderr);

            if(stdout.indexOf('ERROR: FlywayException: Unable to obtain Jdbc connection from DataSource') !== -1) {

                var databaseName = options.url.substring(options.url.lastIndexOf('/') + 1);

                grunt.log.writeln('The connection to your database has failed, is your connection configuration set properly?');
                grunt.log.writeln();
                grunt.log.writeln('Here are the parameters your are using to connect to your database:');
                grunt.log.writeln('  url=' + options.url);
                grunt.log.writeln('  user=' + options.user);
                grunt.log.writeln('  password=' + options.password);

                grunt.log.writeln();
                grunt.log.writeln('If your database connection configuration parameters are valid verify that your database exist.');
                grunt.log.writeln('To create your database you could use the following SQL script:');
                grunt.log.writeln();
                grunt.log.writeln('  -- Creates the database');
                grunt.log.writeln('  create database ' + databaseName + ' default char set UTF8;');
                grunt.log.writeln('  use ' + databaseName + ';');
                grunt.log.writeln();
                grunt.log.writeln('  -- Creates the user used to connect to the database with the right grants');
                grunt.log.writeln('  grant all privileges on ' + databaseName + '.* to \'' + options.user + '\'@\'localhost\' identified by \'' + options.password + '\';');
                grunt.log.writeln('  flush privileges;');
                grunt.log.writeln();

            }

        });

        childProcess.on('exit', function(code) {

            if (code > 0) {

                grunt.log.error(Util.format('Exited with code: %d.', code));

                return done(false);

            }

            grunt.verbose.ok(Util.format('Exited with code: %d.', code));
            return done();
        });

    });
};