'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var zip = require('gulp-zip');
var del = require('del');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');

gulp.task('browserify', function() {
    gulp.src('./src/js/react/*.js')
        .pipe(browserify({transform: 'reactify'}))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./build/js'))
});

gulp.task('del', function() {
    del(['./dist/**/*', './build/**/*'] , function (err, paths) {
        console.log('Deleted files/folders:\n', paths.join('\n'));
    });
});

gulp.task('sass', function() {
    gulp.src('./src/sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest('./build/css'));
});

gulp.task('zip', function () {
    return gulp.src('./build/*')
        .pipe(zip('TABernacle.zip'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('javascript', function () {
    gulp.src('./src/js/*.js')
        .pipe(gulp.dest('./build/js'));
});

gulp.task('css', function () {
    gulp.src('./src/css/*.css')
        .pipe(gulp.dest('./build/css'))
});

gulp.task('move', function () {
    gulp.src(['./src/*.html', './src/*.json'])
        .pipe(gulp.dest('./build'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./src/sass/**/*.scss', ['sass']);
});

gulp.task('watch', function () {
    gulp.watch('./src/js/react/*.js', ['browserify'])
});

gulp.task('build', [
    'sass',
    'javascript',
    'css',
    'move',
    'browserify'
]);

gulp.task('default', ['build']);