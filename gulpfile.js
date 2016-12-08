'use strict';

var gulp = require('gulp');
var es = require('event-stream');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var less = require('gulp-less');
var wrap = require('gulp-wrap');
var watch = require('gulp-watch');
var connect = require('gulp-connect');
var header = require('gulp-header');
var order = require('gulp-order');
var jshint = require('gulp-jshint');
var exec = require('gulp-exec');
var pkg = require('./package.json');

var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

/**
 * Clean ups ./dist folder
 */
gulp.task('clean', function() {
  return gulp
    .src('./dist', {read: false})
    .pipe(clean({force: true}))
    .on('error', log);
});

/**
 * JShint all *.js files
 */
gulp.task('lint', function () {
  return gulp.src('./src/main/javascript/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

/**
 * Build a distribution
 */
gulp.task('dist', ['clean', 'handlebars', 'lint'], _dist);
function _dist() {
  return gulp.src([
        './node_modules/es5-shim/es5-shim.js',
        './src/main/javascript/**/*.js',
        './src/generated/templates.js',
        './node_modules/swagger-client/browser/swagger-client.js'
    ])
    .pipe(order(['**/javascript/**/*.js', '**/generated/templates.js']))
    .pipe(concat('swagger-ui.js'))
    .pipe(wrap('(function(){<%= contents %>}).call(this);'))
    .pipe(header(banner, { pkg: pkg }))
    .pipe(gulp.dest('./dist'))
    .pipe(uglify())
    .on('error', log)
    .pipe(rename({extname: '.min.js'}))
    .on('error', log)
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
}
gulp.task('dev-dist', ['handlebars', 'lint', 'dev-copy'], _dist);

/**
 * Processes less files into CSS files
 */
gulp.task('less', ['clean'], _less);
function _less() {
  return gulp
    .src([
      './src/main/less/screen.less',
      './src/main/less/print.less',
      './src/main/less/reset.less',
      './src/main/less/style.less'
    ])
    .pipe(less())
    .on('error', function(err){ log(err); this.emit('end');})
    .pipe(gulp.dest('./dist/css/'))
    .pipe(connect.reload());
}
gulp.task('dev-less', _less);

/**
 * Copy lib and html folders
 */
gulp.task('copy', ['less'], _copy);
function _copy() {
  // Copy JavaScript files inside lib folder
  gulp
    .src(['./lib/**/*.{js,map}',
        './node_modules/es5-shim/es5-shim.js'
    ])
    .pipe(gulp.dest('./dist/lib'))
    .on('error', log);

  // Copy `lang` for translations
  gulp
    .src(['./lang/**/*.js'])
    .pipe(gulp.dest('./dist/lang'))
    .on('error', log);
  
  // Copy CSS files
  gulp
    .src(['./src/main/custom-css/**/*.css'])
    .pipe(gulp.dest('./dist/css'))
    .on('error', log);

  // Copy all files inside html folder
  gulp
    .src(['./src/main/html/**/*'])
    .pipe(gulp.dest('./dist'))
    .on('error', log);
}
gulp.task('dev-copy', ['dev-less'], _copy);


/**
 * Watch for changes and recompile
 */
gulp.task('watch', function() {
  return watch([
    './src/main/**/*.{js,less,handlebars}',
    './src/main/html/*.html',
    './src/main/custom-css/*.css',
    './test/specs/**/*.{json,yaml}'
    ],
    function() {
      gulp.start('dev-dist');
    });
});

/**
 * Live reload web server of `dist`
 */
gulp.task('connect', function() {
  connect.server({
    root: 'dist',
    livereload: true
  });
});

function log(error) {
  console.error(error.toString && error.toString());
}

gulp.task('handlebars', function () {
  
    var options = {
      continueOnError: false, // default = false, true means don't emit error event 
      pipeStdout: true, // default = false, true means stdout is written to file.contents
    };

    var reportOptions = {
      err: true, // default = true, false means don't write err 
      stderr: true, // default = true, false means don't write stderr 
      stdout: true // default = true, false means don't write stdout 
    }

    gulp.src('./src/main/template/**')
      .pipe(exec('./node_modules/handlebars/bin/handlebars ./src/main/template', options))
      .pipe(wrap('/* jshint ignore:start */ \n {<%= contents %>} \n /* jshint ignore:end */', {}, { parse: false }))
      .pipe(rename('templates.js'))
      .pipe(gulp.dest('./src/generated/'))
      .on('error', log);
});

gulp.task('default', ['dist', 'copy']);
gulp.task('serve', ['connect', 'watch']);
gulp.task('dev', ['default'], function () {
  gulp.start('serve');
});
