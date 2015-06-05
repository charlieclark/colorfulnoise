var gulp = require( 'gulp' );
var paths = require( './paths' );
var config = require( './config' );

var browserify = require( 'browserify' );
var watchify = require( 'watchify' );
var source = require( 'vinyl-source-stream' );

var uglify = require( 'gulp-uglify' );
var rename = require( 'gulp-rename' );
var livereload = require( 'gulp-livereload' );
var notify = require( 'gulp-notify' );

var watch;
var myBundle = null;

gulp.task( 'user_scripts_min', [ 'browserify_nowatch' ], function() {

	return gulp.src( paths.dist + config.fileName + '.js' )
		.pipe( uglify() )
		.pipe( rename( config.fileName + '.min.js' ) )
		.pipe( gulp.dest( paths.dist ) )
} );

gulp.task( 'browserify_watch', function() {

	watch = true;
	return browserifyWrap();
} );

gulp.task( 'browserify_nowatch', function() {

	watch = false
	return browserifyWrap();
} );

function browserifyWrap() {

	b = browserify( {
		debug: true,
		paths: [ paths.src, paths.nodeModules ],
		cache: {},
		packageCache: {},
		standalone: config.className
	} )

	if ( watch ) {
		b = watchify( b );
		b.on( 'update', function() {
			console.log( "user code updated" );
			bundle( b );
		} );
	}

	b.add( paths.src + config.fileName + '.js' );
	bundle( b );
};

function bundle( myBundle ) {

	return myBundle.bundle()
		.on( 'error', function( err ) {
			gulp.src( paths.noop )
				.pipe( notify( "your JS broke idiot! " + err ) );
		} )
		.pipe( source( config.fileName + '.js' ) )
		.pipe( gulp.dest( paths.dist ) )
		.pipe( livereload() );
};