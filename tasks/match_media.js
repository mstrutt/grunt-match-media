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

			function trimRule (rule) {
				if (rule.indexOf('(') > -1)
					rule = rule.substring( rule.indexOf('(')+1, rule.lastIndexOf(')') );

				return rule.trim();
			}

			function extractConditions (query) {
				var conditions = query.substring(query.indexOf('@media')+6, query.indexOf('{')).split(',');

				for (var i = 0; i < conditions.length; i++) {
					var r = conditions[i];

					conditions[i] = [];

					while (r.indexOf('and') > -1) {
						conditions[i].push( trimRule( r.substring(0, r.indexOf('and')) ) );

						r = r.substring(r.indexOf('and')+3);
					}

					conditions[i].push(trimRule(r));
				}
					
				return conditions;
			}

			function checkCondition (cond, width, unit) {
				var mUnit, mWidth, result;

				cond = cond.replace(' ', '').split(':');

				if (!cond[1])
					return cond[0].indexOf('print') === -1;

				mUnit = getUnit(cond[1]);
				mWidth = parseInt(cond[1], 10);

				if (unit !== mUnit) {
					if (unit === 'em')
						mWidth = options.px_em_ratio * mWidth;
					if (mUnit === 'em')
						mWidth = mWidth/options.px_em_ratio;
				}

				if (cond[0] === 'min-width')
					return (width >= mWidth);
				else
					return (width <= mWidth);
			}

			function evalMedia (width, query) {
				var conditions = extractConditions(query),
					condition,
					unit = getUnit(width),
					match = false;

				width = parseInt(width, 10);

				while(conditions.length && !match) {
					condition = conditions.pop();
					
					match = true;

					condition.forEach(function(cond) {
						match = match && checkCondition(cond, width, unit);
					});

					console.log(width+unit + ' is ' + match + ' at "' + condition.join(' and ') + '"');
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
