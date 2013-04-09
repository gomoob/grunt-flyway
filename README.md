# grunt-flyway

> Run Flyway database migration tool with Grunt.

## WARNING
This Grunt plugin and has not been tested thorougly yet so use it at your own risk ! 

For now the plugin supports only basic Flyway configuration options and it can only execute the ```clean```, ```init``` and ```migrate``` commands.

## Getting Started

### Installing the plugin
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-flyway --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-flyway');
```

### Installing Java
The plugin uses [Flyway](http://flywaydb.org) "The Agile Database Migration Framework" which is developped in Java.

So, you have to install Java and have the ```java``` executable available in your PATH.  

## Flyway version
The plugin uses [Flyway](http://flywaydb.org) 2.1.1. 

## The "flyway" task

### Overview
In your project's Gruntfile, add a section named `flyway` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  flyway: {
    options: {
      driver : 'com.mysql.jdbc.Driver',
      initDescription : 'Sample database created using Flyway :-)',
      initVersion : '1.0',
      locations: 'filesystem:src/main/resources/sql/migration',
      url : 'jdbc:mysql://localhost/flyway',
      user : 'flyway',
      password : 'flyway'
    },
    clean: {
      command : 'clean'
    },
    init: {
      command : 'init'
    },
    migrate: {
      command : 'migrate'
    }
  },
})
```

The name of the Grunt targets to use inside the `flyway` task configuration are not pre-defined, you can choose what you want to name those targets.

Any number of targets can be defined and you can have multiple targets with different configurations, for example : 

```js
grunt.initConfig({
  flyway: {
    options: {
      driver : 'com.mysql.jdbc.Driver',
      initDescription : 'Sample database created using Flyway :-)',
      initVersion : '1.0',
      locations: 'filesystem:src/main/resources/sql/migration',
      url : 'jdbc:mysql://localhost/db1',
      user : 'flyway',
      password : 'flyway'
    },
    clean_db1: {
      command : 'clean'
    },
    clean_db2: {
      options {
        url : 'jdbc:mysql://localhost/db2'
      },
      command : 'clean',
    },
    init_db1: {
      command : 'init'
    },
    init_db2: {
      options {
        url : 'jdbc:mysql://localhost/db2'
      },
      command : 'init'
    },
    migrate_db1: {
      command : 'migrate'
    }, 
    migrate_db2: {
      options {
        url : 'jdbc:mysql://localhost/db2'
      },
      command : 'migrate'
    }
  },
})
```

The only commands which are supported for the moment are `clean`, `init` and `migrate`. 

### Options

#### options.driver
Type: `String`
Default value: `'TODO'`

The fully qualified classname of the jdbc driver to use to connect to the database.

#### options.initDescription
Type: `String`
Default value: `'TODO'`

The description of the initial version.

### options.initVersion
Type: `String`
Default value: `TODO`

The initial version to put in the database.

### options.locations
Type: `String`
Default value: `TODO`

Comma-separated list of locations to scan recursively for migrations. The location type is determined by its prefix.
Unprefixed locations or locations starting with classpath: point to a package on the classpath and may contain both sql and java-based migrations.
Locations starting with filesystem: point to a directory on the filesystem and may only contain sql migrations.

### options.password
Type: `String`
Default value: `TODO`

The password to use to connect to the database.

### options.user
Type: `String`
Default value: `TODO`

The user to use to connect to the database.

### options.url
Type: `String`
Default value: `TODO`

The jdbc url to use to connect to the database.

### Usage Examples

Simply call the [Flyway](http://flywaydb.org) targets you've defined inside your Gruntfile : 

```grunt flyway:clean```

```grunt flyway:init```

```grunt flyway:migrate```

## Release History
_(Nothing yet)_
