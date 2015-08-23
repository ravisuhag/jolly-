'use strict';

var Gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var RevAll = require('gulp-rev-all');
var jshint = require('gulp-jshint');

var revAll = new RevAll();
var paths = require('./config/assets');

function loadTask(task) {
    return require('./tasks/' + task)(Gulp);
}

Gulp.task('nodemon', loadTask('nodemon'));

Gulp.task('watch', ['dev-build'], function() {
    Gulp.watch(paths.get('/fonts'), ['fonts']);
    Gulp.watch(paths.get('/styles'), ['styles']);
    Gulp.watch(paths.get('/scripts/vendor'), ['concat']);
});

Gulp.task('styles', function() {
    return Gulp.src('./assets/styles/index.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(Gulp.dest('public/css/'));
});

Gulp.task('concat', function() {
    return Gulp.src(paths.get('/scripts/vendor'))
        .pipe(uglify())
        .pipe(concat('vendor.min.js'))
        .pipe(Gulp.dest('public/js/'));
});

Gulp.task('fonts', function() {
    return Gulp.src(paths.get('/fonts'))
        .pipe(Gulp.dest('public/fonts'));
});

Gulp.task('images', function() {
    return Gulp.src(paths.get('/images'))
        .pipe(Gulp.dest('public/images'));
});

Gulp.task('misc', function() {
    return Gulp.src(paths.get('/misc'))
        .pipe(Gulp.dest('public/misc'));
});

Gulp.task('lint', function() {
    return Gulp.src(paths.get('/lintables'))
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

Gulp.task('rev', ['browserify', 'styles'], function() {
    return Gulp.src(['static/js/index.js', 'static/js/index.min.js', 'static/css/index.css', 'static/js/vendor.min.js'])
        .pipe(revAll.revision())
        .pipe(Gulp.dest('static'))
        .pipe(revAll.manifestFile())
        .pipe(Gulp.dest('static'));
});



Gulp.task('dev-build', ['fonts', 'images', 'misc', 'styles', 'concat', 'lint']);
Gulp.task('prod-build', ['dev-build', 'rev']);
Gulp.task('build', ['prod-build']);
Gulp.task('dev', ['dev-build', 'nodemon', 'watch']);
Gulp.task('default', ['dev']);