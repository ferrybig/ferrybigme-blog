const gulp = require('gulp');
const lint = require('gulp-remark-lint-dko');
const clean = require('gulp-clean');
const marked = require('marked');
const through = require('through2');
const pygmentizebundled = require('pygmentize-bundled');
const extreplace = require('gulp-ext-replace');
const properties = require('properties');

gulp.task('lint', function() {
	return gulp
		.src(['posts/**/*.md'])
		.pipe(
			lint({
				rules: {
					'definition-case': false,
					'emphasis-marker': '_'
				}
			})
		)
		.pipe(lint.report());
});

gulp.task('clean', function() {
	return gulp.src(['build']).pipe(clean());
});

gulp.task('build', ['clean', 'lint'], function() {
	return gulp
		.src(['posts/**/*.md'])
		.pipe(
			through.obj(function(chunk, enc, cb) {
				const renderer = new marked.Renderer();
				const renderedheading = renderer.heading;
				renderer.heading = function(text, level) {
					const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
					if (!chunk.toc) {
						chunk.toc = [];
					}
					chunk.toc.push({ anchor: escapedText, level });
					return `<h${level} id="${escapedText}">${text}</h${level}>`;
				};
				const highlight = function(code, lang, callback) {
					if (lang === 'blogoptions') {
						properties.parse(code, {}, function(error, obj) {
							chunk.fileoptions = obj;
							callback(error, undefined);
						});
						return callback(undefined, '');
					} else {
						pygmentizebundled({ lang: lang, format: 'html' }, code, function(err, result) {
							callback(err, result ? result.toString() : 'undefined??');
						});
					}
				};
				marked(
					chunk.contents.toString(),
					{
						highlight,
						renderer,
						gfm: true,
						tables: true,
						breaks: false,
						pedantic: false,
						sanitize: false,
						smartLists: true,
						smartypants: false
					},
					function(err, content) {
						if (err) cb(err, chunk);
						if (chunk.fileoptions) {
							content =
								'<!--' +
								JSON.stringify(chunk.fileoptions) +
								JSON.stringify(chunk.toc) +
								'-->' +
								content.replace('<pre><code class="lang-blogoptions">\n</code></pre>\n', '');
						}
						chunk.contents = new Buffer(content);
						cb(null, chunk);
					}
				);
			})
		)
		.pipe(extreplace('.html'))
		.pipe(gulp.dest('build'));
});

gulp.task('default', ['build']);
