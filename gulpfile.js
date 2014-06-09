/*global require*/
var gulp = require('gulp');
var hint = require('gulp-jshint');
var rename = require('gulp-rename');
var size = require('gulp-size');
var uglify = require('gulp-uglify');
var qunit = require('gulp-qunit');
var less = require('gulp-less');

gulp.task('lint', function() {
    return gulp.src('slicer.js')
                .pipe(hint())
                .pipe(hint.reporter('default'));
});


gulp.task('script', function() {
    return gulp.src('slicer.js')
                .pipe(rename('slicer.min.js'))
                .pipe(size({title: 'development'}))
                .pipe(uglify())
                .pipe(gulp.dest(''))
                .pipe(size({title: 'minified'}))
                .pipe(size({title: 'gzip', gzip: true}));   
});

gulp.task('less', function(){
    return gulp.src('./examples/*.less')
                .pipe(less());
});


gulp.task('watch', function() {
    gulp.watch('slicer.js', ['lint', 'script', 'test']);
    
    gulp.watch('test/test.js', ['test']);
    
    gulp.watch('examples/*.less', ['less']);
});


gulp.task('test', function() {
    return gulp.src('./test/runner.html').pipe(qunit());
});


gulp.task('default', ['lint', 'test', 'script', 'less', 'watch']);