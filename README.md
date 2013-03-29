# grunt-flyway

> Run Flyway database migration tool with Grunt.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-flyway --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-flyway');
```

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

### Options

#### options.driver
Type: `String`
Default value: `'TODO'`

TODO

#### options.initDescription
Type: `String`
Default value: `'TODO'`

TODO

### options.initVersion
### options.password
### options.user
### options.url

### Usage Examples
```grunt flyway:clean```

## Release History
_(Nothing yet)_
