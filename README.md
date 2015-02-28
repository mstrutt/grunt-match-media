# grunt-match-media

[![NPM version](https://img.shields.io/npm/v/grunt-match-media.svg)](https://www.npmjs.com/package/grunt-match-media) [![NPM Downloads](https://img.shields.io/npm/dm/grunt-match-media.svg)](https://www.npmjs.com/package/grunt-match-media) [![Dependencies](https://img.shields.io/david/mstrutt/grunt-match-media.svg)](https://david-dm.org/mstrutt/grunt-match-media#info=dependencies) [![Dev Dependencies](https://img.shields.io/david/dev/mstrutt/grunt-match-media.svg)](https://david-dm.org/mstrutt/grunt-match-media#info=devDependencies) [![Build Status](https://img.shields.io/travis/mstrutt/grunt-match-media/master.svg)](https://travis-ci.org/mstrutt/grunt-match-media)

> Grunt wrapper for [node-match-media](https://www.npmjs.com/package/node-match-media) - plugin to extract styles matching certain media conditions, and create separate stylesheets with them

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-match-media --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-match-media');
```

## The "match_media" task

### Overview
In your project's Gruntfile, add a section named `match_media` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  match_media: {
    my_task: {
      options: {
        // Task-specific options go here.
      },
      your_target: {
        // Target-specific file lists and/or options go here.
      }
    }
  }
});
```

### Options

#### options.width
Type: `String`
Default value: `'960px'`

The viewport width for media queries to be evaluated against (in `em` or `px`).

#### options.height
Type: `String`
Default value: `'768px'`

The viewport height for media queries to be evaluated against (in `em` or `px`).

#### options.px_em_ratio
Type: `Integer`
Default value: `16`

How many `px` to treat `1em` as (by default `1em` is treated as `16px`)

#### options.orientation
Type: `String`
Default value: `undefined`

What orientation queries to match, options are `'landscape'`, `'portrait'`, or `'both'`

#### options.with_queries
Type: `Boolean`
Default value: `false`

Preserves the media statements in the output CSS (default option is to write the styles without the query). This new option is useful for creating stylesheets for specific device ranges (but still have media queries within them).

#### options.always_match
Type: `Array of Strings`
Default value: `[]`

In case any options you require aren't covered by the task yet, you can pass a list of query types in to always match, whatever their value. Eg: `['min-device-pixel-ratio']`

### Usage Examples

#### Default Options
In this example, the styles from `styles.css` then `other-styles.css` are evaluated and any media queries which would apply in a `960px` width browser are written into `desktop-syles.css`.

```js
grunt.initConfig({
  match_media: {
    desktop: {
      files: {
        'desktop-styles.css': ['styles.css', 'other-styles.css']
      }
    }
  }
});
```

#### Custom Options
In this example, the styles from `styles.css` then `other-styles.css` are evaluated and any media queries which would apply in a `20em` (or `20em * 16px = 320px`) width browser are written into `mobile-syles.css`.

```js
grunt.initConfig({
  match_media: {
    mobile: {
      options: {
        width: '20em',
        px_em_ratio: 16,
        orientation: 'portrait',
        always_match: [
          'min-device-pixel-ratio'
        ],
        with_queries: true
      },
      files: {
        'mobile-styles.css': ['styles.css', 'other-styles.css']
      }
    }
  }
});
```

## Contributing
All of the functionality is now contained in the [node-match-media project](https://github.com/mstrutt/node-match-media) so any contributions may be more appropriate there.

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

* `0.1.0` Abstracting main functionality into [node-match-media project](https://github.com/mstrutt/node-match-media)
* `0.0.7` Supporting `orientation``queries (thanks for the nudge [zeorin](https://github.com/zeorin)), and an option to always match certain queries
* `0.0.6` New `with_queries` option added (thanks to [lukaszzdanikowski](https://github.com/lukaszzdanikowski) for working on this)
* `0.0.5` Support for `device` sized media queries to map to the appropriate `min`/`max` `width`, extended to support `height`-based media queries
* `0.0.4` Support for `and` and `,` in statements, as well as a binary check between `print` and all other media types
* `0.0.3` Small bugfixes
* `0.0.2` Support for using `em` and `px` with a conversion between the two
* `0.0.1` Basic functionality
