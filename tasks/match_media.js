/*
 * grunt-match-media
 * https://github.com/mstrutt/grunt-match-media
 *
 * Copyright (c) 2013 Michael Strutt
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	// Please see the Grunt documentation for more information regarding task
	// creation: http://gruntjs.com/creating-tasks

	grunt.registerMultiTask('match_media', 'Grunt plugin to extract styles matching certain width conditions, and create separate stylesheets with them', function() {
		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			width: '960px',
			px_em_ratio: 16
		});

		// Iterate over all specified file groups.
		this.files.forEach(function(f) {
			// Concat specified files.
			var css = f.src.filter(function(filepath) {
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

			// Real inner workings

			function getUnit (value) {
				return ((value.indexOf('px') > -1) ? 'px' : 'em' );
			}

			function extractRules (mediaBlock) {
				// Commenting out the head and tail for the @media declaration
				mediaBlock = mediaBlock.replace(/(@media[^{]*{)/gmi, "/* $1 */");
				mediaBlock = mediaBlock.substring(0, mediaBlock.lastIndexOf('}')) + "/* } */";
				return mediaBlock;
			}

			function extractConditions (query) {
				var conditions = [];
				while (query.indexOf('(') > -1) {
					var start = query.lastIndexOf('(');
					conditions.push( query.substring( start+1, query.lastIndexOf(')') ) );
					query = query.substring(0, start);
				}
				return conditions;
			}

			function evalMedia (width, query) {
				var conditions = extractConditions(query),
					match = true,
					unit = getUnit(width);

				width = parseInt(width, 10);

				while (conditions.length && match) {
					var cond = conditions.pop().replace(' ', '').split(':'),
						mUnit = getUnit(cond[1]),
						mWidth = parseInt(cond[1], 10);

					if (unit !== mUnit) {
						if (unit === 'em')
							mWidth = options.px_em_ratio * mWidth;
						if (mUnit === 'em')
							mWidth = mWidth/options.px_em_ratio;
					}

					if (cond[0] === 'min-width')
						match = (width >= mWidth);
					else
						match = (width <= mWidth);
				}

				return match;
			}

			function getMediaBlocks (styles) {
				return styles.match(/(@media[^{]*{(?:(?!}\s*})[\s\S])*}[\s\S]*?})/gmi);
			}

			var mediaBlocks = getMediaBlocks(css),
				newMedia = [];

			if (mediaBlocks)
				mediaBlocks.forEach(function (mediaBlock) {
					if (evalMedia(options.width, mediaBlock))
						newMedia.push(extractRules(mediaBlock));
				});

			// Write the destination file.
			grunt.file.write(f.dest, newMedia.join("\n\n"));

			// Print a success message.
			grunt.log.writeln('File "' + f.dest + '" created.');
		});
	});

};
