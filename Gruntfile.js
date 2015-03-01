/*
 * grunt-match-media
 * https://github.com/mstrutt/grunt-match-media
 *
 * Copyright (c) 2014 Michael Strutt
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
	var test_path = require.resolve('match-media-tests'),
		test_spec;

	test_path = test_path.substring(0, test_path.lastIndexOf('/'));

	test_spec = require(test_path + '/spec.js');

	test_spec.fixtures = test_spec.fixtures.map(function(fixture_path) {
		return test_path + '/' + fixture_path;
	});

	// Project configuration.
	var config = {
		jshint: {
			all: [
				'Gruntfile.js',
				'tasks/*.js'
			],
			options: {
				jshintrc: '.jshintrc',
			}
		},

		// Before generating any new files, remove any previously-created files.
		clean: {
			tests: [test_path + '/output'],
		},

		execute: {
			test: {
				src: [test_path + '/test.js']
			}
		},

		// Configuration to be run (and then tested).
		match_media: {}
	};

	Object.keys(test_spec.options).forEach(function(key) {
		var files = {};

		files[test_path + '/output/' + key + '.css'] = test_spec.fixtures;

		config.match_media[key] = {
			options: test_spec.options[key],
			files: files
		};
	});

	grunt.initConfig(config);

	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-execute');

	grunt.registerTask('test', ['jshint', 'match_media', 'execute:test']);

	grunt.registerTask('default', ['test']);

};
