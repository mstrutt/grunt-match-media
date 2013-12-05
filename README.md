# grunt-extract-media

> Grunt plugin to extract styles matching certain width conditions, and create separate stylesheets with them

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-extract-media --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-extract-media');
```

## The "extract_media" task

### Overview
In your project's Gruntfile, add a section named `extract_media` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  extract_media: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.width
Type: `String`
Default value: `'960px'`

The viewport width for media queries to be evaluated against (for now use exclusively `em` or exclusively `px`).

### Usage Examples

#### Default Options
In this example, the styles from `styles.css` then `other-styles.css` are evaluated and any media queries which would apply in a `960px` width browser are written into `desktop-syles.css`.

```js
grunt.initConfig({
  extract_media: {
    files: {
      'desktop-styles.css': ['styles.css', 'other-styles.css'],
    },
  },
});
```

#### Custom Options
In this example, the styles from `styles.css` then `other-styles.css` are evaluated and any media queries which would apply in a `320px` width browser are written into `mobile-syles.css`.

```js
grunt.initConfig({
  extract_media: {
    options: {
      width: '320px'
    },
    files: {
      'mobile-styles.css': ['styles.css', 'other-styles.css'],
    },
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_