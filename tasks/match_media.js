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
			height: '768px',
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

			// checking for unit match and converting if needed
			function convertUnit (xUnit, mUnit, mVal) {
				if (xUnit !== mUnit) {
					if (mUnit === 'em')
						mVal = options.px_em_ratio * mVal;
					if (xUnit === 'em')
						mVal = mVal/options.px_em_ratio;
				}

				return mVal;
			}

			function needsUnits (condition) {
				var conditionsThatNeedUnits = [
					'min-width',
					'min-device-width',
					'max-width',
					'max-device-width',
					'min-height',
					'min-device-height',
					'max-height',
					'max-device-height'
				];

				return conditionsThatNeedUnits.indexOf(condition) >= 0;
			}

			function extractRules (mediaBlock) {
				// Commenting out the head and tail for the @media declaration only if with_queries is falsy
				if (!options.with_queries) {
					mediaBlock = mediaBlock.replace(/(@media[^{]*{)/gmi, "/* $1 */");
					mediaBlock = mediaBlock.substring(0, mediaBlock.lastIndexOf('}')) + "/* } */";
				}
				return mediaBlock;
			}

			function trimRule (rule) {
				// Remove brackets if any are present
				if (rule.indexOf('(') > -1)
					rule = rule.substring( rule.indexOf('(')+1, rule.lastIndexOf(')') );

				// Trime off whitespace and return
				return rule.trim();
			}

			function extractConditions (query) {
				// Extracting @media query and splitting on ',' to allow for separate evaluation
				var conditions = query.substring(query.indexOf('@media')+6, query.indexOf('{')).split(','),
					i;

				for (i = 0; i < conditions.length; i++) {
					var r = conditions[i];

					conditions[i] = [];

					// creating array off all 'and'ed rules to evaluate
					while (r.match(/\band\b/)) {
						conditions[i].push( trimRule( r.substring(0, r.indexOf('and')) ) );

						r = r.substring(r.indexOf('and')+3);
					}

					conditions[i].push(trimRule(r));
				}
					
				return conditions;
			}

			function checkCondition (cond) {
				var width, wUnit, height, hUnit, mUnit, mVal, result;

				cond = cond.replace(' ', '').split(':');

				// if no pair in rule, pass if 'print' is not present or 'print' is 'not'ed
				if (!cond[1])
					return !(cond[0].indexOf('print') > -1 && cond[0].indexOf('not') === -1);

				// Only generate all the numbers and units for queries that need them
				if (needsUnits(cond[0])) {
					width = parseInt(options.width, 10),
					wUnit = getUnit(options.width),
					height = parseInt(options.height, 10),
					hUnit = getUnit(options.height),
					mUnit = getUnit(cond[1]);
					mVal = parseInt(cond[1], 10);
				}

				switch (cond[0]) {
					case 'min-width':
					case 'min-device-width':
						mVal = convertUnit(wUnit, mUnit, mVal);
						result = (width >= mVal);
						break;
					case 'max-width':
					case 'max-device-width':
						mVal = convertUnit(wUnit, mUnit, mVal);
						result = (width <= mVal);
						break;
					case 'min-height':
					case 'min-device-height':
						mVal = convertUnit(hUnit, mUnit, mVal);
						result = (height >= mVal);
						break;
					case 'max-height':
					case 'max-device-height':
						mVal = convertUnit(hUnit, mUnit, mVal);
						result = (height <= mVal);
						break;
					case 'orientation':
						if (options.orientation)
							result = (options.orientation === 'both' || options.orientation === cond[1]);
						else
							result = false;
						break;
				}

				// console.log(cond, result);

				return result;
			}

			function evalMedia (query) {
				var conditions = extractConditions(query),
					condition,
					match = false;

				// For ',' will pass as soon as one matches
				while (conditions.length && !match) {
					condition = conditions.pop();
					
					// resetting the match flag
					match = true;

					// for 'and' will pass only if all conditions do (true && true = true, true && false = false, false && true = false)
					condition.forEach(function(cond) {
						match = match && checkCondition(cond);
					});

					// console.log(width+unit + ' is ' + match + ' at "' + condition.join(' and ') + '"');
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
					if (evalMedia(mediaBlock))
						newMedia.push(extractRules(mediaBlock));
				});

			// Write the destination file.
			grunt.file.write(f.dest, newMedia.join("\n\n"));

			// Print a success message.
			grunt.log.writeln('File "' + f.dest + '" created.');
		});
	});

};
