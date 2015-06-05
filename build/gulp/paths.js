var buildPath = global._root + "/";
var rootPath = buildPath.replace( "build/", "" );

module.exports = {
	src: rootPath + "src/",
	dist: rootPath + "dist/",
	nodeModules: rootPath + "node_modules/",
	noop: buildPath + "noop.js"
}