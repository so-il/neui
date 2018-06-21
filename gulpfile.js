'use strict';

var pkg = require('./package.json'),
    gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename'),
    header = require('gulp-header'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    less = require('gulp-less'),
    nano = require('gulp-cssnano'),
    sourcemaps = require('gulp-sourcemaps'),
    merge = require('merge-stream'),
    combiner = require('stream-combiner2'),
    browserify = require("browserify"),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer');

var banner = [
        '/*!',
        ' * <%= pkg.name %> v<%= pkg.version %> (<%= pkg.homepage %>)',
        ' * Copyright <%= new Date().getFullYear() %> <%= pkg.author %>',
        ' * Licensed under the <%= pkg.license %> license',
        ' */\n\n',
    ].join('\n'),
    distPath = './dist/',
    stylePath = './src/style/',
    scriptPath = './src/script/',
    iconPath = stylePath + 'icon/neui-icons/Web-TT/';

gulp.task('build:style', function (callback) {
    gulp.src([
            stylePath + 'neui.less',
            stylePath + 'lib/reset.less',
            stylePath + 'lib/color.less',
            stylePath + 'lib/layout.less',
            stylePath + 'lib/animate.less',
            stylePath + 'lib/fragment.less',
            stylePath + 'lib/single.less',
            stylePath + 'ui/*.less'
        ])
        .pipe(concat(pkg.name + '.css'))
        .pipe(less().on('error', function (e) {
            console.error(e)
        }))
        .pipe(header(banner, {
            pkg: pkg
        }))
        .pipe(gulp.dest(distPath))
        .pipe(nano())
        .pipe(rename(function (path) {
            path.basename += '.min'
        }))
        .pipe(gulp.dest(distPath));
    callback();
});

gulp.task('build:script', function (callback) {
    var stream_ne = browserify({
            entries: scriptPath + "ne.js"
        })
        .bundle()
        .pipe(source('1.js'))
        .pipe(buffer());

    var stream_ui = gulp.src([
            scriptPath + 'ui/*.js'
        ])
        .pipe(concat('2.js'))
        .pipe(buffer());

    setTimeout(function () {
        merge([stream_ne, stream_ui])
            .pipe(concat(pkg.name + '.js'))
            .pipe(header('"use strict";'))
            .pipe(header(banner, {
                pkg: pkg
            }))
            .pipe(jshint())
            .pipe(gulp.dest(distPath))
            .pipe(uglify().on('error', function (e) {
                console.error(e)
            }))
            .pipe(rename(function (path) {
                path.basename += '.min'
            }))
            .pipe(gulp.dest(distPath));
    }, 500);
    callback();
});

gulp.task('build:icon', function (callback) {
    gulp.src([
            iconPath + 'neui-icons.ttf',
            iconPath + 'neui-icons.eot',
            iconPath + 'neui-icons.woff'
        ])
        .pipe(gulp.dest(distPath + 'icons/'));
    callback();
});

gulp.task('build', ['build:icon', 'build:style', 'build:script'], function (callback) {
    callback();
});

gulp.task('watch', ['build'], function () {
    gulp.watch(stylePath + '*', ['build:style']);
    gulp.watch(scriptPath + '*', ['build:script']);
});