(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Rainbow = require( "Rainbow" );
},{"Rainbow":2}],2:[function(require,module,exports){
( function () {

    var numRange = 100;

    //RAINBOW CLASS
    function Rainbow( spectrum ) {

        this._gradients = null;
        this._colors = null;
        this.setColors( spectrum );
    }

    Rainbow.prototype = {

        setColors: function ( spectrum ) {

            var increment = this._segmentLength = numRange / ( spectrum.length - 1 );

            this._gradients = [];

            for ( var i = 0; i < spectrum.length - 1; i++ ) {
                var colorGradient = new ColorGradient(
                    spectrum[ i ],
                    spectrum[ i + 1 ],
                    increment * i,
                    increment * ( i + 1 )
                );
                this._gradients[ i ] = colorGradient;
            }

            this._colors = spectrum;

        },

        colorAt: function ( ratio, inRgb ) {

            var number = ratio * numRange;
            var index = Math.min( Math.floor( number / this._segmentLength ), this._gradients.length - 1 );
            return this._gradients[ index ].colorAt( number, inRgb );
        }
    }

    //COLOR GRADIENT CLASS
    function ColorGradient( colorStart, colorEnd, minNumber, maxNumber ) {

        this._startColor = getHexColor( colorStart );
        this._endColor = getHexColor( colorEnd );
        this._minNumber = minNumber;
        this._maxNumber = maxNumber;
    }

    ColorGradient.prototype = {

        colorAt: function ( number, inRgb ) {

            var r = this.calcInt( number, this._startColor.substring( 0, 2 ), this._endColor.substring( 0, 2 ) );
            var g = this.calcInt( number, this._startColor.substring( 2, 4 ), this._endColor.substring( 2, 4 ) );
            var b = this.calcInt( number, this._startColor.substring( 4, 6 ), this._endColor.substring( 4, 6 ) );

            if ( inRgb === true ) {
                return [ r, g, b ];
            } else {
                return calcHex( r ) + calcHex( g ) + calcHex( b );
            }

        },

        calcInt: function ( number, channelStart_Base16, channelEnd_Base16 ) {

            var num = Math.min( Math.max( number, this._minNumber ), this._maxNumber );
            var numRange = this._maxNumber - this._minNumber;

            var cStart_Base10 = parseInt( channelStart_Base16, 16 );
            var cEnd_Base10 = parseInt( channelEnd_Base16, 16 );
            var cPerUnit = ( cEnd_Base10 - cStart_Base10 ) / numRange;
            var c_Base10 = Math.round( cPerUnit * ( num - this._minNumber ) + cStart_Base10 );

            return c_Base10;
        }
    }

    //UTILS
    function calcHex( integer ) {
        return formatHex( integer.toString( 16 ) );
    }

    function formatHex( hex ) {
        return ( hex.length === 1 ) ? '0' + hex : hex;
    }

    function getHexColor( string ) {
        return string.substring( string.length - 6, string.length );
    }

    //EXPORTING as global var in browser of as export in node
    var root = this;
    if ( typeof exports !== 'undefined' ) {
        if ( typeof module !== 'undefined' && module.exports ) {
            exports = module.exports = Rainbow;
        }
        exports.Rainbow = Rainbow;
    } else {
        root.Rainbow = Rainbow;
    }
} )();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9jb2xvcmZ1bG5vaXNlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL1JhaW5ib3cvcmFpbmJvdy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBSYWluYm93ID0gcmVxdWlyZSggXCJSYWluYm93XCIgKTsiLCIoIGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciBudW1SYW5nZSA9IDEwMDtcblxuICAgIC8vUkFJTkJPVyBDTEFTU1xuICAgIGZ1bmN0aW9uIFJhaW5ib3coIHNwZWN0cnVtICkge1xuXG4gICAgICAgIHRoaXMuX2dyYWRpZW50cyA9IG51bGw7XG4gICAgICAgIHRoaXMuX2NvbG9ycyA9IG51bGw7XG4gICAgICAgIHRoaXMuc2V0Q29sb3JzKCBzcGVjdHJ1bSApO1xuICAgIH1cblxuICAgIFJhaW5ib3cucHJvdG90eXBlID0ge1xuXG4gICAgICAgIHNldENvbG9yczogZnVuY3Rpb24gKCBzcGVjdHJ1bSApIHtcblxuICAgICAgICAgICAgdmFyIGluY3JlbWVudCA9IHRoaXMuX3NlZ21lbnRMZW5ndGggPSBudW1SYW5nZSAvICggc3BlY3RydW0ubGVuZ3RoIC0gMSApO1xuXG4gICAgICAgICAgICB0aGlzLl9ncmFkaWVudHMgPSBbXTtcblxuICAgICAgICAgICAgZm9yICggdmFyIGkgPSAwOyBpIDwgc3BlY3RydW0ubGVuZ3RoIC0gMTsgaSsrICkge1xuICAgICAgICAgICAgICAgIHZhciBjb2xvckdyYWRpZW50ID0gbmV3IENvbG9yR3JhZGllbnQoXG4gICAgICAgICAgICAgICAgICAgIHNwZWN0cnVtWyBpIF0sXG4gICAgICAgICAgICAgICAgICAgIHNwZWN0cnVtWyBpICsgMSBdLFxuICAgICAgICAgICAgICAgICAgICBpbmNyZW1lbnQgKiBpLFxuICAgICAgICAgICAgICAgICAgICBpbmNyZW1lbnQgKiAoIGkgKyAxIClcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHRoaXMuX2dyYWRpZW50c1sgaSBdID0gY29sb3JHcmFkaWVudDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fY29sb3JzID0gc3BlY3RydW07XG5cbiAgICAgICAgfSxcblxuICAgICAgICBjb2xvckF0OiBmdW5jdGlvbiAoIHJhdGlvLCBpblJnYiApIHtcblxuICAgICAgICAgICAgdmFyIG51bWJlciA9IHJhdGlvICogbnVtUmFuZ2U7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSBNYXRoLm1pbiggTWF0aC5mbG9vciggbnVtYmVyIC8gdGhpcy5fc2VnbWVudExlbmd0aCApLCB0aGlzLl9ncmFkaWVudHMubGVuZ3RoIC0gMSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2dyYWRpZW50c1sgaW5kZXggXS5jb2xvckF0KCBudW1iZXIsIGluUmdiICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvL0NPTE9SIEdSQURJRU5UIENMQVNTXG4gICAgZnVuY3Rpb24gQ29sb3JHcmFkaWVudCggY29sb3JTdGFydCwgY29sb3JFbmQsIG1pbk51bWJlciwgbWF4TnVtYmVyICkge1xuXG4gICAgICAgIHRoaXMuX3N0YXJ0Q29sb3IgPSBnZXRIZXhDb2xvciggY29sb3JTdGFydCApO1xuICAgICAgICB0aGlzLl9lbmRDb2xvciA9IGdldEhleENvbG9yKCBjb2xvckVuZCApO1xuICAgICAgICB0aGlzLl9taW5OdW1iZXIgPSBtaW5OdW1iZXI7XG4gICAgICAgIHRoaXMuX21heE51bWJlciA9IG1heE51bWJlcjtcbiAgICB9XG5cbiAgICBDb2xvckdyYWRpZW50LnByb3RvdHlwZSA9IHtcblxuICAgICAgICBjb2xvckF0OiBmdW5jdGlvbiAoIG51bWJlciwgaW5SZ2IgKSB7XG5cbiAgICAgICAgICAgIHZhciByID0gdGhpcy5jYWxjSW50KCBudW1iZXIsIHRoaXMuX3N0YXJ0Q29sb3Iuc3Vic3RyaW5nKCAwLCAyICksIHRoaXMuX2VuZENvbG9yLnN1YnN0cmluZyggMCwgMiApICk7XG4gICAgICAgICAgICB2YXIgZyA9IHRoaXMuY2FsY0ludCggbnVtYmVyLCB0aGlzLl9zdGFydENvbG9yLnN1YnN0cmluZyggMiwgNCApLCB0aGlzLl9lbmRDb2xvci5zdWJzdHJpbmcoIDIsIDQgKSApO1xuICAgICAgICAgICAgdmFyIGIgPSB0aGlzLmNhbGNJbnQoIG51bWJlciwgdGhpcy5fc3RhcnRDb2xvci5zdWJzdHJpbmcoIDQsIDYgKSwgdGhpcy5fZW5kQ29sb3Iuc3Vic3RyaW5nKCA0LCA2ICkgKTtcblxuICAgICAgICAgICAgaWYgKCBpblJnYiA9PT0gdHJ1ZSApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gWyByLCBnLCBiIF07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxjSGV4KCByICkgKyBjYWxjSGV4KCBnICkgKyBjYWxjSGV4KCBiICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSxcblxuICAgICAgICBjYWxjSW50OiBmdW5jdGlvbiAoIG51bWJlciwgY2hhbm5lbFN0YXJ0X0Jhc2UxNiwgY2hhbm5lbEVuZF9CYXNlMTYgKSB7XG5cbiAgICAgICAgICAgIHZhciBudW0gPSBNYXRoLm1pbiggTWF0aC5tYXgoIG51bWJlciwgdGhpcy5fbWluTnVtYmVyICksIHRoaXMuX21heE51bWJlciApO1xuICAgICAgICAgICAgdmFyIG51bVJhbmdlID0gdGhpcy5fbWF4TnVtYmVyIC0gdGhpcy5fbWluTnVtYmVyO1xuXG4gICAgICAgICAgICB2YXIgY1N0YXJ0X0Jhc2UxMCA9IHBhcnNlSW50KCBjaGFubmVsU3RhcnRfQmFzZTE2LCAxNiApO1xuICAgICAgICAgICAgdmFyIGNFbmRfQmFzZTEwID0gcGFyc2VJbnQoIGNoYW5uZWxFbmRfQmFzZTE2LCAxNiApO1xuICAgICAgICAgICAgdmFyIGNQZXJVbml0ID0gKCBjRW5kX0Jhc2UxMCAtIGNTdGFydF9CYXNlMTAgKSAvIG51bVJhbmdlO1xuICAgICAgICAgICAgdmFyIGNfQmFzZTEwID0gTWF0aC5yb3VuZCggY1BlclVuaXQgKiAoIG51bSAtIHRoaXMuX21pbk51bWJlciApICsgY1N0YXJ0X0Jhc2UxMCApO1xuXG4gICAgICAgICAgICByZXR1cm4gY19CYXNlMTA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvL1VUSUxTXG4gICAgZnVuY3Rpb24gY2FsY0hleCggaW50ZWdlciApIHtcbiAgICAgICAgcmV0dXJuIGZvcm1hdEhleCggaW50ZWdlci50b1N0cmluZyggMTYgKSApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdEhleCggaGV4ICkge1xuICAgICAgICByZXR1cm4gKCBoZXgubGVuZ3RoID09PSAxICkgPyAnMCcgKyBoZXggOiBoZXg7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0SGV4Q29sb3IoIHN0cmluZyApIHtcbiAgICAgICAgcmV0dXJuIHN0cmluZy5zdWJzdHJpbmcoIHN0cmluZy5sZW5ndGggLSA2LCBzdHJpbmcubGVuZ3RoICk7XG4gICAgfVxuXG4gICAgLy9FWFBPUlRJTkcgYXMgZ2xvYmFsIHZhciBpbiBicm93c2VyIG9mIGFzIGV4cG9ydCBpbiBub2RlXG4gICAgdmFyIHJvb3QgPSB0aGlzO1xuICAgIGlmICggdHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICBpZiAoIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzICkge1xuICAgICAgICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gUmFpbmJvdztcbiAgICAgICAgfVxuICAgICAgICBleHBvcnRzLlJhaW5ib3cgPSBSYWluYm93O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJvb3QuUmFpbmJvdyA9IFJhaW5ib3c7XG4gICAgfVxufSApKCk7XG4iXX0=
