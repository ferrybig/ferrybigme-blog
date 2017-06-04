const gulp = require('gulp');
const fileToJson = require('gulp-file-to-json');
const markdown = require('gulp-markdown');
const lint = require('gulp-remark-lint-dko');

gulp.task('lint', function () {
	return gulp.src(['posts/**/*.md'])
			.pipe(lint({
				rules: {
					'definition-case': false,
					'emphasis-marker': '_',
				}
			}))
			.pipe(lint.report());
});

gulp.task('default', ['lint'], function () {
	return gulp.src(['posts/**/*.md'])
			.pipe(markdown())
			.pipe(fileToJson())
			.pipe(gulp.dest('build'));
});
