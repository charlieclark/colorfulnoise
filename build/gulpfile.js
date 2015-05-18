//todo
//dev task
//finish release task 

//rules : on branches only edit paths.js
//if you feel the need to edit a task, create a new one - this should make maintenance easier

//getting arguments
var argv = require( 'minimist' )( process.argv.slice( 2 ) );

//setting root relative 
global._root = __dirname;
global._release = argv.env == "release";

//breaking out tasks
require( "./gulp/browserify" );
require( "./gulp/watch" );