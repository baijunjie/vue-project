var gulp = require('gulp'),
	i18n = require('gulp-i18n-combine'),
	clean = require('gulp-clean');

var distPath = '../static/data/i18n/',
	srcPath = '../src/**/*-*.json';

gulp.task('i18nClean', function () {
	return gulp.src(distPath, { read: false })
		.pipe(clean({ force: true }));
});

gulp.task('i18n', ['i18nClean'], function () {
	return gulp.src(srcPath)
		.pipe(i18n())
		.pipe(gulp.dest(distPath));
});

// 监听文件修改
gulp.task('i18nWatch', function () {
	gulp.watch(srcPath, ['i18n']);
});

gulp.task('default', ['i18n']);