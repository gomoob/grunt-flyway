# grunt-flyway

> Run Flyway database migration tool with Grunt.

## WARNING
This Grunt plugin and has not been tested thoroughly yet so use it at your own risk!

The plugin supports all Flyway configuration options for `clean`, `init`, `migrate` and `validate` commands.

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
The plugin uses [Flyway](http://flywaydb.org) "The Agile Database Migration Framework" which is developed in Java.

So, you have to install Java and have the `java` executable available in your PATH.

## Flyway version
The plugin uses [Flyway](http://flywaydb.org) 2.1.1.

## The "flyway" task

### Overview
In your project's Gruntfile, add a section named `flyway` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  flyway: {
    options: {
      driver: 'com.mysql.jdbc.Driver',
      url: 'jdbc:mysql://localhost/flyway',
      user: 'flyway',
      password: 'flyway'
    },
    clean: {
      command: 'clean'
    },
    init: {
      options: {
        initDescription: 'Sample database created using Flyway:-)',
        initVersion: '1.0'
      },
      command: 'init'
    },
    migrate: {
      options: {
        locations: 'filesystem:src/main/resources/sql/migration'
      },
      command: 'migrate'
    }
  }
})
```

The name of the Grunt targets to use inside the `flyway` task configuration are not pre-defined, you can choose what you want to name those targets.

Any number of targets can be defined and you can have multiple targets with different configurations, for example:

```js
grunt.initConfig({
  flyway: {
    options: {
      driver: 'com.mysql.jdbc.Driver',
      url: 'jdbc:mysql://localhost/db1',
      user: 'flyway',
      password: 'flyway'
    },
    clean_db1: {
      command: 'clean'
    },
    clean_db2: {
      options {
        url: 'jdbc:mysql://localhost/db2'
      },
      command: 'clean',
    },
    init_db1: {
      options: {
        initDescription: 'Sample database created using Flyway:-)',
        initVersion: '1.0'
      },
      command: 'init'
    },
    init_db2: {
      options {
        url: 'jdbc:mysql://localhost/db2',
        initDescription: 'Sample database created using Flyway:-)',
        initVersion: '1.0'
      },
      command: 'init'
    },
    migrate_db1: {
      options: {
        locations: 'filesystem:src/main/resources/sql/migration'
      },
      command: 'migrate'
    },
    migrate_db2: {
      options {
        url: 'jdbc:mysql://localhost/db2',
        locations: 'filesystem:src/main/resources/sql/migration',
        placeholders: {
          name: 'Tom'
        }
      },
      command: 'migrate'
    }
  }
})
```

The only commands which are supported for the moment are `clean`, `init`, `migrate` and `validate`.

### Options

Options' descriptions come from [Flyway's documentation](http://flywaydb.org/documentation/commandline/).

#### clean

|option|required|default|description|
|------|--------|-------|-----------|
|url|yes||The jdbc url to use to connect to the database|
|driver|no|_Auto-detected based on url_|The fully qualified classname of the jdbc driver to use to connect to the database|
|user|no||The user to use to connect to the database|
|password|no||The password to use to connect to the database|
|schemas|no|_default schema of the connection_|Comma-separated case-sensitive list of schemas managed by Flyway. <br><br> The schemas will be cleaned in the order of this list.|
|jarDir|no|`<install-dir>`/jars|The directory containing the JDBC driver|

#### init

|option|required|default|description|
|------|--------|-------|-----------|
|url|yes||The jdbc url to use to connect to the database|
|driver|no|_Auto-detected based on url_|The fully qualified classname of the jdbc driver to use to connect to the database|
|user|no||The user to use to connect to the database|
|password|no||The password to use to connect to the database|
|schemas|no|_default schema of the connection_|Comma-separated case-sensitive list of schemas managed by Flyway. <br><br> The first schema will be the one containing the metadata table.|
|table|no|`schema_version`|The name of Flyway's metadata table. <br><br> By default (single-schema mode) the metadata table is placed in the default schema for the connection provided by the datasource. <br><br> When the `schemas` property is set (multi-schema mode), the metadata table is placed in the first schema of the list.|
|jarDir|no|`<install-dir>`/jars|The directory containing the JDBC driver|
|initVersion|no|1|The initial version to put in the database|
|initDescription|no|`<< Flyway Init >>`|The description of the initial version|

#### migrate

|option|required|default|description|
|------|--------|-------|-----------|
|url|yes||The jdbc url to use to connect to the database|
|driver|no|_Auto-detected based on url_|The fully qualified classname of the jdbc driver to use to connect to the database|
|user|no||The user to use to connect to the database|
|password|no||The password to use to connect to the database|
|schemas|no|_default schema of the connection_|Comma-separated case-sensitive list of schemas managed by Flyway. <br><br> The first schema in the list will be automatically set as the default one during the migration. It will also be the one containing the metadata table.|
|table|no|`schema_version`|The name of Flyway's metadata table. By default (single-schema mode) the metadata table is placed in the default schema for the connection provided by the datasource. When the `schemas` property is set (multi-schema mode), the metadata table is placed in the first schema of the list.|
|locations|no|filesystem:`<install-dir>`/sql|Comma-separated list of locations to scan recursively for migrations. The location type is determined by its prefix. <br><br> Unprefixed locations or locations starting with `classpath:` point to a package on the classpath and may contain both sql and java-based migrations. <br><br> Locations starting with `filesystem:` point to a directory on the filesystem and may only contain sql migrations.|
|jarDir|no|`<install-dir>`/jars|The directory containing the JDBC driver|
|sqlMigrationPrefix|no|V|The file name prefix for sql migrations|
|sqlMigrationSuffix|no|.sql|The file name suffix for sql migrations|
|encoding|no|UTF-8|The encoding of sql migrations|
|placeholders._name_|no||Placeholders to replace in sql migrations|
|placeholderPrefix|no|${|The prefix of every placeholder|
|placeholderSuffix|no|}|The suffix of every placeholder|
|target|no|_latest version_|The target version up to which Flyway should run migrations. Migrations with a higher version number will not be applied.|
|outOfOrder|no|false|Allows migrations to be run "out of order". <br><br> If you already have versions 1 and 3 applied, and now a version 2 is found, it will be applied too instead of being ignored.|
|validateOnMigrate|no|false|Whether to automatically call validate or not when running migrate. <br><br> For each sql migration a CRC32 checksum is calculated when the sql script is executed. The validate mechanism checks if the sql migration in the classpath still has the same checksum as the sql migration already executed in the database.|
|cleanOnValidationError|no|false|Whether to automatically call clean or not when a validation error occurs. <br><br> This is exclusively intended as a convenience for development. Even tough we strongly recommend not to change migration scripts once they have been checked into SCM and run, this provides a way of dealing with this case in a smooth manner. The database will be wiped clean automatically, ensuring that the next migration will bring you back to the state checked into SCM. <br><br> **Warning! Do not enable in production!**|
|initOnMigrate|no|false|Whether to automatically call init when migrate is executed against a non-empty schema with no metadata table. This schema will then be initialized with the `initVersion` before executing the migrations. Only migrations above `initVersion` will then be applied. <br><br> This is useful for initial Flyway production deployments on projects with an existing DB. <br><br> Be careful when enabling this as it removes the safety net that ensures Flyway does not migrate the wrong database in case of a configuration mistake!
|initVersion|no|1|The initial version to put in the database|
|initDescription|no|`<< Flyway Init >>`|The description of the initial version|

#### validate

|option|required|default|description|
|------|--------|-------|-----------|
|url|yes||The jdbc url to use to connect to the database|
|driver|no|_Auto-detected based on url_|The fully qualified classname of the jdbc driver to use to connect to the database|
|user|no||The user to use to connect to the database|
|password|no||The password to use to connect to the database|
|schemas|no|_default schema of the connection_|Comma-separated case-sensitive list of schemas managed by Flyway. <br><br> The first schema will be the one containing the metadata table.|
|table|no|`schema_version`|The name of Flyway's metadata table. By default (single-schema mode) the metadata table is placed in the default schema for the connection provided by the datasource. When the `schemas` property is set (multi-schema mode), the metadata table is placed in the first schema of the list.|
|locations|no|filesystem:`<install-dir>`/sql|Comma-separated list of locations to scan recursively for migrations. The location type is determined by its prefix. <br><br> Unprefixed locations or locations starting with `classpath:` point to a package on the classpath and may contain both sql and java-based migrations. <br><br> Locations starting with `filesystem:` point to a directory on the filesystem and may only contain sql migrations.|
|jarDir|no|`<install-dir>`/jars|The directory containing the JDBC driver|
|sqlMigrationPrefix|no|V|The file name prefix for sql migrations|
|sqlMigrationSuffix|no|.sql|The file name suffix for sql migrations|
|encoding|no|UTF-8|The encoding of sql migrations|
|placeholders._name_|no||Placeholders to replace in sql migrations|
|placeholderPrefix|no|${|The prefix of every placeholder|
|placeholderSuffix|no|}|The suffix of every placeholder|
|target|no|_latest version_|The target version up to which Flyway should run migrations. Migrations with a higher version number will not be applied.|
|outOfOrder|no|false|Allows migrations to be run "out of order". <br><br> If you already have versions 1 and 3 applied, and now a version 2 is found, it will be applied too instead of being ignored.|
|cleanOnValidationError|no|false|Whether to automatically call clean or not when a validation error occurs. <br><br> This is exclusively intended as a convenience for development. Even tough we strongly recommend not to change migration scripts once they have been checked into SCM and run, this provides a way of dealing with this case in a smooth manner. The database will be wiped clean automatically, ensuring that the next migration will bring you back to the state checked into SCM. <br><br> **Warning! Do not enable in production!**|

### Usage Examples

Simply call the [Flyway](http://flywaydb.org) targets you've defined inside your Gruntfile:

`grunt flyway:clean`

`grunt flyway:init`

`grunt flyway:migrate`

`grunt flyway:validate`

## Release History

### 0.2.1

  * Add `develop` branch has been created, pull request have to be performed on this branch now
  * Upgrade to Flyway 2.3

### 0.2.0

  * Added support for `validate` command
  * Added support for all options for each supported command
  * Added configuration validation
    * Required options cause an error when not present
    * Any extra option that is not available for selected command also causes an error
  * Fix JSHint Lint errors

### 0.1.1
  * Fix a Flyway classpath build problem under UNIX. The ';' character was used instead ':'.
