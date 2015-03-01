/*
 * grunt-match-media
 * https://github.com/mstrutt/grunt-match-media
 *
 * Copyright (c) 2014 Michael Strutt
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
	var matchMedia = require('node-match-media');

	// Please see the Grunt documentation for more information regarding task
	// creation: http://gruntjs.com/creating-tasks

	grunt.registerMultiTask('match_media', 'Grunt plugin to extract styles matching certain width conditions, and create separate stylesheets with them', function() {
		// Merge task-specific and/or target-specific options with these defaults.
		var task = this,
			css, output;

		matchMedia.configure(task.options(matchMedia.defaults));

		// Iterate over all specified file groups.
		task.files.forEach(function(file) {
			// Concat specified files.
			css = file.src.filter(function(filepath) {
				// Warn on and remove invalid source files (if nonull was set).
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;
				} else {
					return true;
				}
			}).map(function(filepath) {
				// Read file source.
				return grunt.file.read(filepath);
			}).join("\n");

			output = matchMedia.run(css);

			// Write the destination file.
			grunt.file.write(file.dest, output);

			// Print a success message.
			grunt.log.writeln('File "' + file.dest + '" created.');
		});
	});

};
