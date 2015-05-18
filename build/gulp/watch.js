var gulp = require( 'gulp' );

var livereload = require( 'gulp-livereload' );
// var paths = require( "./paths" );
// var plugins = require( "./plugins" );

/* WATCH */
gulp.task( 'watch', [ 'browserify_watch' ], function() {

	livereload.listen();
} );