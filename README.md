# grunt-match-media

> Grunt plugin to extract styles matching certain width conditions, and create separate stylesheets with them

## Getting Started
This plugin requires Grunt `~0.4.2`

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
      }
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

#### options.px_em_ratio
Type: `Integer`
Default value: `16`

How many `px` to treat `1em` as (by default `1em` is treated as `16px`)

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
    desktop: {
      options: {
        width: '20em',
        px_em_ratio: 16
      },
      files: {
        'mobile-styles.css': ['styles.css', 'other-styles.css']
      }
    }
  }
});
```

## Caveats / Todos

At the moment, functionality is limited to `min-width` and `max-width` media queries, and it is assumed at all connecting statements are `and`. There is also no differentiation between screen and print or any other media types

* Support for OR media queries
* Checking for screen, print and other thing media types
* Possibility to include more queries such as `min-device-pixel-ratio` or `min-height` and `max-height`;

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

* `0.0.2` Support for using `em` and `px` with a conversion between the two
* `0.0.1` Basic functionality