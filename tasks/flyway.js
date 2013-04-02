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
        var options = this.options({
            locations : 'sql/migration', 
            table : 'schema_version'
        });
        
        var done = this.async();
        
        var flywayBinPath = Path.resolve(__dirname, '../flyway-commandline-2.1.1/bin');
        
        var classPathSeparator = ';';
        
        if(Os.platform() === 'linux') {
            classPathSeparator = ':';
        }

        var javaClasspath = flywayBinPath + '/flyway-commandline-2.1.1.jar' + classPathSeparator;
        javaClasspath = javaClasspath + flywayBinPath + '/flyway-core-2.1.1.jar';
        
        // Checks if the provided Flyway command name is valid
        if(this.data.command !== 'clean' && 
           this.data.command !== 'init' && 
           this.data.command !== 'migrate') {
           
            grunt.log.error(Util.format('Flyway does not provide any command named \'%s\' !', this.data.command));
            
            done(false);
            
        }
        
        var flywayCommand = 'java -cp ' + javaClasspath + ' com.googlecode.flyway.commandline.Main ' + this.data.command;
        
        flywayCommand += ' -locations=' + options.locations;
        flywayCommand += ' -initDescription="' + options.initDescription + '"';
        flywayCommand += ' -initVersion=' + options.initVersion;
        flywayCommand += ' -table=' + options.table;
        flywayCommand += ' -url=' + options.url;
        flywayCommand += ' -user=' + options.user;
        flywayCommand += ' -password=' + options.password;
        
        grunt.log.write(flywayCommand);

        var childProcess = ChildProcess.exec(flywayCommand, function(error, stdout, stderr) {
            
            grunt.log.writeln();
            grunt.log.writeln(error);
            grunt.log.writeln(stdout);
            grunt.log.writeln(stderr);
            
            if(stdout.indexOf('ERROR: FlywayException: Unable to obtain Jdbc connection from DataSource') !== -1) {
                
                var databaseName = options.url.substring(options.url.lastIndexOf('/') + 1);
                
                grunt.log.writeln('The connection to your database has failed, is your connection configuration set properly ?');
                grunt.log.writeln();
                grunt.log.writeln('Here are the parameters your are using to connect to your database :');
                grunt.log.writeln('  url=' + options.url);
                grunt.log.writeln('  user=' + options.user);
                grunt.log.writeln('  password=' + options.password);

                grunt.log.writeln();
                grunt.log.writeln('If your database connection configuration parameters are valid verify that your database exist.');
                grunt.log.writeln('To create your database you could use the following SQL script :');
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
            done();
        });

    });
};
