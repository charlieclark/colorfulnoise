!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.ColorfulNoise=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// IMPLEMENTATION OF IMPROVED NOISE - COPYRIGHT 2002 KEN PERLIN.
( function() {
  var p = [];
  var permutation = [ 151, 160, 137, 91, 90, 15,
    131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23,
    190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
    88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166,
    77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,
    102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
    135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123,
    5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
    223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
    129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228,
    251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
    49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
    138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180
  ];

  for ( var i = 0; i < 256; i++ )
    p[ 256 + i ] = p[ i ] = permutation[ i ];

  function Noise( x, y, z ) {
    var X = Math.floor( x ) & 255,
      Y = Math.floor( y ) & 255,
      Z = Math.floor( z ) & 255;
    x -= Math.floor( x );
    y -= Math.floor( y );
    z -= Math.floor( z );

    var u = fade( x ),
      v = fade( y ),
      w = fade( z );
    var A = p[ X ] + Y,
      AA = p[ A ] + Z,
      AB = p[ A + 1 ] + Z,
      B = p[ X + 1 ] + Y,
      BA = p[ B ] + Z,
      BB = p[ B + 1 ] + Z;

    return lerp( w, lerp( v, lerp( u, grad( p[ AA ], x, y, z ),
          grad( p[ BA ], x - 1, y, z ) ),
        lerp( u, grad( p[ AB ], x, y - 1, z ),
          grad( p[ BB ], x - 1, y - 1, z ) ) ),
      lerp( v, lerp( u, grad( p[ AA + 1 ], x, y, z - 1 ),
          grad( p[ BA + 1 ], x - 1, y, z - 1 ) ),
        lerp( u, grad( p[ AB + 1 ], x, y - 1, z - 1 ),
          grad( p[ BB + 1 ], x - 1, y - 1, z - 1 ) ) ) );
  }

  function fade( t ) {
    return t * t * t * ( t * ( t * 6 - 15 ) + 10 );
  }

  function lerp( t, a, b ) {
    return a + t * ( b - a );
  }

  function grad( hash, x, y, z ) {
    var h = hash & 15;
    var u = h < 8 ? x : y,
      v = h < 4 ? y : h == 12 || h == 14 ? x : z;
    return ( ( h & 1 ) == 0 ? u : -u ) + ( ( h & 2 ) == 0 ? v : -v );
  }

  //EXPORTING as global var in browser or as export in node
  if ( typeof exports !== 'undefined' ) {
    if ( typeof module !== 'undefined' && module.exports ) {
      exports = module.exports = Noise;
    }
    exports.Noise = Noise;
  } else {
    this.Noise = Noise;
  }
} )();
},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
( function() {

	//dependencies
	var Noise = require( "improvednoise" );
	var Rainbow = require( "rainbow" );

	var minSize = 5;
	var maxSize = 200;

	var minFrequency = 1 / 1000;
	var maxFrequency = 1 / 30;

	var minSpeed = 0.001;
	var maxSpeed = 0.1;

	function ColorfulNoise( options ) {

		this._width = minSize + ( options.quality * ( maxSize - minSize ) );
		this._height = this._width;

		this._colors = options.colors || [ '#F970F8', '#F9FBB1', '#AAFEA3', '#94FEF7', '#F9FBB1', '#F970F8' ];

		this._freq = minFrequency + ( options.granularity * ( maxFrequency - minFrequency ) );

		this._speed = minSpeed + ( options.speed * ( maxSpeed - minSpeed ) );

		this._animating = false;

		this._z = 0;
		this.init();
	}

	ColorfulNoise.prototype = {

		init: function() {

			var canvas = document.createElement( "canvas" );
			var rainbow = new Rainbow( this._colors );

			this._canvas = canvas;
			this._ctx = canvas.getContext( "2d" );
			this._rainbow = rainbow;

			this.resize()
		},

		updateNoise: function() {

			var rainbow = this._rainbow;
			var canvas = this._canvas;
			var context = this._ctx;
			var freq = this._freq;
			var z = ( this._z += this._speed );
			var pix = context.createImageData( canvas.width, canvas.height );
			var inc = 0;
			for ( var y = 0; y < canvas.height; y++ ) {
				for ( var x = 0; x < canvas.width; x++ ) {
					var n = Noise( x * this._freq, y * this._freq, z ) + .5;
					// console.log( n );
					n = Math.min( Math.max( 0, n ), 1 );

					var rgb = rainbow.colorAt( n, true );
					pix.data[ inc++ ] = rgb[ 0 ];
					pix.data[ inc++ ] = rgb[ 1 ];
					pix.data[ inc++ ] = rgb[ 2 ];
					pix.data[ inc++ ] = 255;
				}
			}
			context.putImageData( pix, 0, 0 );
		},

		start: function() {

			this._animating = true;
			this.animate();
		},

		start: function() {

			this._animating = false;
		},

		animate: function() {

			if ( this._animating ) {
				requestAnimationFrame( this.animate.bind( this ) );
				this.updateNoise();
			}
		},

		update: function() {

			this.updateNoise();
		},

		resize: function() {

			this._canvas.width = this._width;
			this._canvas.height = this._height;
		},

		getCanvas: function() {

			return this._canvas;
		}
	}

	//exporting other libraries
	ColorfulNoise.Noise = Noise;
	ColorfulNoise.Rainbow = Rainbow;

	module.exports = ColorfulNoise;
} )();
},{"improvednoise":1,"rainbow":2}]},{},[3])(3)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9ub2RlX21vZHVsZXMvaW1wcm92ZWRub2lzZS9pbXByb3ZlZG5vaXNlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3JhaW5ib3cvcmFpbmJvdy5qcyIsIi4uL3NyYy9jb2xvcmZ1bG5vaXNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gSU1QTEVNRU5UQVRJT04gT0YgSU1QUk9WRUQgTk9JU0UgLSBDT1BZUklHSFQgMjAwMiBLRU4gUEVSTElOLlxuKCBmdW5jdGlvbigpIHtcbiAgdmFyIHAgPSBbXTtcbiAgdmFyIHBlcm11dGF0aW9uID0gWyAxNTEsIDE2MCwgMTM3LCA5MSwgOTAsIDE1LFxuICAgIDEzMSwgMTMsIDIwMSwgOTUsIDk2LCA1MywgMTk0LCAyMzMsIDcsIDIyNSwgMTQwLCAzNiwgMTAzLCAzMCwgNjksIDE0MiwgOCwgOTksIDM3LCAyNDAsIDIxLCAxMCwgMjMsXG4gICAgMTkwLCA2LCAxNDgsIDI0NywgMTIwLCAyMzQsIDc1LCAwLCAyNiwgMTk3LCA2MiwgOTQsIDI1MiwgMjE5LCAyMDMsIDExNywgMzUsIDExLCAzMiwgNTcsIDE3NywgMzMsXG4gICAgODgsIDIzNywgMTQ5LCA1NiwgODcsIDE3NCwgMjAsIDEyNSwgMTM2LCAxNzEsIDE2OCwgNjgsIDE3NSwgNzQsIDE2NSwgNzEsIDEzNCwgMTM5LCA0OCwgMjcsIDE2NixcbiAgICA3NywgMTQ2LCAxNTgsIDIzMSwgODMsIDExMSwgMjI5LCAxMjIsIDYwLCAyMTEsIDEzMywgMjMwLCAyMjAsIDEwNSwgOTIsIDQxLCA1NSwgNDYsIDI0NSwgNDAsIDI0NCxcbiAgICAxMDIsIDE0MywgNTQsIDY1LCAyNSwgNjMsIDE2MSwgMSwgMjE2LCA4MCwgNzMsIDIwOSwgNzYsIDEzMiwgMTg3LCAyMDgsIDg5LCAxOCwgMTY5LCAyMDAsIDE5NixcbiAgICAxMzUsIDEzMCwgMTE2LCAxODgsIDE1OSwgODYsIDE2NCwgMTAwLCAxMDksIDE5OCwgMTczLCAxODYsIDMsIDY0LCA1MiwgMjE3LCAyMjYsIDI1MCwgMTI0LCAxMjMsXG4gICAgNSwgMjAyLCAzOCwgMTQ3LCAxMTgsIDEyNiwgMjU1LCA4MiwgODUsIDIxMiwgMjA3LCAyMDYsIDU5LCAyMjcsIDQ3LCAxNiwgNTgsIDE3LCAxODIsIDE4OSwgMjgsIDQyLFxuICAgIDIyMywgMTgzLCAxNzAsIDIxMywgMTE5LCAyNDgsIDE1MiwgMiwgNDQsIDE1NCwgMTYzLCA3MCwgMjIxLCAxNTMsIDEwMSwgMTU1LCAxNjcsIDQzLCAxNzIsIDksXG4gICAgMTI5LCAyMiwgMzksIDI1MywgMTksIDk4LCAxMDgsIDExMCwgNzksIDExMywgMjI0LCAyMzIsIDE3OCwgMTg1LCAxMTIsIDEwNCwgMjE4LCAyNDYsIDk3LCAyMjgsXG4gICAgMjUxLCAzNCwgMjQyLCAxOTMsIDIzOCwgMjEwLCAxNDQsIDEyLCAxOTEsIDE3OSwgMTYyLCAyNDEsIDgxLCA1MSwgMTQ1LCAyMzUsIDI0OSwgMTQsIDIzOSwgMTA3LFxuICAgIDQ5LCAxOTIsIDIxNCwgMzEsIDE4MSwgMTk5LCAxMDYsIDE1NywgMTg0LCA4NCwgMjA0LCAxNzYsIDExNSwgMTIxLCA1MCwgNDUsIDEyNywgNCwgMTUwLCAyNTQsXG4gICAgMTM4LCAyMzYsIDIwNSwgOTMsIDIyMiwgMTE0LCA2NywgMjksIDI0LCA3MiwgMjQzLCAxNDEsIDEyOCwgMTk1LCA3OCwgNjYsIDIxNSwgNjEsIDE1NiwgMTgwXG4gIF07XG5cbiAgZm9yICggdmFyIGkgPSAwOyBpIDwgMjU2OyBpKysgKVxuICAgIHBbIDI1NiArIGkgXSA9IHBbIGkgXSA9IHBlcm11dGF0aW9uWyBpIF07XG5cbiAgZnVuY3Rpb24gTm9pc2UoIHgsIHksIHogKSB7XG4gICAgdmFyIFggPSBNYXRoLmZsb29yKCB4ICkgJiAyNTUsXG4gICAgICBZID0gTWF0aC5mbG9vciggeSApICYgMjU1LFxuICAgICAgWiA9IE1hdGguZmxvb3IoIHogKSAmIDI1NTtcbiAgICB4IC09IE1hdGguZmxvb3IoIHggKTtcbiAgICB5IC09IE1hdGguZmxvb3IoIHkgKTtcbiAgICB6IC09IE1hdGguZmxvb3IoIHogKTtcblxuICAgIHZhciB1ID0gZmFkZSggeCApLFxuICAgICAgdiA9IGZhZGUoIHkgKSxcbiAgICAgIHcgPSBmYWRlKCB6ICk7XG4gICAgdmFyIEEgPSBwWyBYIF0gKyBZLFxuICAgICAgQUEgPSBwWyBBIF0gKyBaLFxuICAgICAgQUIgPSBwWyBBICsgMSBdICsgWixcbiAgICAgIEIgPSBwWyBYICsgMSBdICsgWSxcbiAgICAgIEJBID0gcFsgQiBdICsgWixcbiAgICAgIEJCID0gcFsgQiArIDEgXSArIFo7XG5cbiAgICByZXR1cm4gbGVycCggdywgbGVycCggdiwgbGVycCggdSwgZ3JhZCggcFsgQUEgXSwgeCwgeSwgeiApLFxuICAgICAgICAgIGdyYWQoIHBbIEJBIF0sIHggLSAxLCB5LCB6ICkgKSxcbiAgICAgICAgbGVycCggdSwgZ3JhZCggcFsgQUIgXSwgeCwgeSAtIDEsIHogKSxcbiAgICAgICAgICBncmFkKCBwWyBCQiBdLCB4IC0gMSwgeSAtIDEsIHogKSApICksXG4gICAgICBsZXJwKCB2LCBsZXJwKCB1LCBncmFkKCBwWyBBQSArIDEgXSwgeCwgeSwgeiAtIDEgKSxcbiAgICAgICAgICBncmFkKCBwWyBCQSArIDEgXSwgeCAtIDEsIHksIHogLSAxICkgKSxcbiAgICAgICAgbGVycCggdSwgZ3JhZCggcFsgQUIgKyAxIF0sIHgsIHkgLSAxLCB6IC0gMSApLFxuICAgICAgICAgIGdyYWQoIHBbIEJCICsgMSBdLCB4IC0gMSwgeSAtIDEsIHogLSAxICkgKSApICk7XG4gIH1cblxuICBmdW5jdGlvbiBmYWRlKCB0ICkge1xuICAgIHJldHVybiB0ICogdCAqIHQgKiAoIHQgKiAoIHQgKiA2IC0gMTUgKSArIDEwICk7XG4gIH1cblxuICBmdW5jdGlvbiBsZXJwKCB0LCBhLCBiICkge1xuICAgIHJldHVybiBhICsgdCAqICggYiAtIGEgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdyYWQoIGhhc2gsIHgsIHksIHogKSB7XG4gICAgdmFyIGggPSBoYXNoICYgMTU7XG4gICAgdmFyIHUgPSBoIDwgOCA/IHggOiB5LFxuICAgICAgdiA9IGggPCA0ID8geSA6IGggPT0gMTIgfHwgaCA9PSAxNCA/IHggOiB6O1xuICAgIHJldHVybiAoICggaCAmIDEgKSA9PSAwID8gdSA6IC11ICkgKyAoICggaCAmIDIgKSA9PSAwID8gdiA6IC12ICk7XG4gIH1cblxuICAvL0VYUE9SVElORyBhcyBnbG9iYWwgdmFyIGluIGJyb3dzZXIgb3IgYXMgZXhwb3J0IGluIG5vZGVcbiAgaWYgKCB0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgaWYgKCB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cyApIHtcbiAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IE5vaXNlO1xuICAgIH1cbiAgICBleHBvcnRzLk5vaXNlID0gTm9pc2U7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5Ob2lzZSA9IE5vaXNlO1xuICB9XG59ICkoKTsiLCIoIGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciBudW1SYW5nZSA9IDEwMDtcblxuICAgIC8vUkFJTkJPVyBDTEFTU1xuICAgIGZ1bmN0aW9uIFJhaW5ib3coIHNwZWN0cnVtICkge1xuXG4gICAgICAgIHRoaXMuX2dyYWRpZW50cyA9IG51bGw7XG4gICAgICAgIHRoaXMuX2NvbG9ycyA9IG51bGw7XG4gICAgICAgIHRoaXMuc2V0Q29sb3JzKCBzcGVjdHJ1bSApO1xuICAgIH1cblxuICAgIFJhaW5ib3cucHJvdG90eXBlID0ge1xuXG4gICAgICAgIHNldENvbG9yczogZnVuY3Rpb24gKCBzcGVjdHJ1bSApIHtcblxuICAgICAgICAgICAgdmFyIGluY3JlbWVudCA9IHRoaXMuX3NlZ21lbnRMZW5ndGggPSBudW1SYW5nZSAvICggc3BlY3RydW0ubGVuZ3RoIC0gMSApO1xuXG4gICAgICAgICAgICB0aGlzLl9ncmFkaWVudHMgPSBbXTtcblxuICAgICAgICAgICAgZm9yICggdmFyIGkgPSAwOyBpIDwgc3BlY3RydW0ubGVuZ3RoIC0gMTsgaSsrICkge1xuICAgICAgICAgICAgICAgIHZhciBjb2xvckdyYWRpZW50ID0gbmV3IENvbG9yR3JhZGllbnQoXG4gICAgICAgICAgICAgICAgICAgIHNwZWN0cnVtWyBpIF0sXG4gICAgICAgICAgICAgICAgICAgIHNwZWN0cnVtWyBpICsgMSBdLFxuICAgICAgICAgICAgICAgICAgICBpbmNyZW1lbnQgKiBpLFxuICAgICAgICAgICAgICAgICAgICBpbmNyZW1lbnQgKiAoIGkgKyAxIClcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHRoaXMuX2dyYWRpZW50c1sgaSBdID0gY29sb3JHcmFkaWVudDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fY29sb3JzID0gc3BlY3RydW07XG5cbiAgICAgICAgfSxcblxuICAgICAgICBjb2xvckF0OiBmdW5jdGlvbiAoIHJhdGlvLCBpblJnYiApIHtcblxuICAgICAgICAgICAgdmFyIG51bWJlciA9IHJhdGlvICogbnVtUmFuZ2U7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSBNYXRoLm1pbiggTWF0aC5mbG9vciggbnVtYmVyIC8gdGhpcy5fc2VnbWVudExlbmd0aCApLCB0aGlzLl9ncmFkaWVudHMubGVuZ3RoIC0gMSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2dyYWRpZW50c1sgaW5kZXggXS5jb2xvckF0KCBudW1iZXIsIGluUmdiICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvL0NPTE9SIEdSQURJRU5UIENMQVNTXG4gICAgZnVuY3Rpb24gQ29sb3JHcmFkaWVudCggY29sb3JTdGFydCwgY29sb3JFbmQsIG1pbk51bWJlciwgbWF4TnVtYmVyICkge1xuXG4gICAgICAgIHRoaXMuX3N0YXJ0Q29sb3IgPSBnZXRIZXhDb2xvciggY29sb3JTdGFydCApO1xuICAgICAgICB0aGlzLl9lbmRDb2xvciA9IGdldEhleENvbG9yKCBjb2xvckVuZCApO1xuICAgICAgICB0aGlzLl9taW5OdW1iZXIgPSBtaW5OdW1iZXI7XG4gICAgICAgIHRoaXMuX21heE51bWJlciA9IG1heE51bWJlcjtcbiAgICB9XG5cbiAgICBDb2xvckdyYWRpZW50LnByb3RvdHlwZSA9IHtcblxuICAgICAgICBjb2xvckF0OiBmdW5jdGlvbiAoIG51bWJlciwgaW5SZ2IgKSB7XG5cbiAgICAgICAgICAgIHZhciByID0gdGhpcy5jYWxjSW50KCBudW1iZXIsIHRoaXMuX3N0YXJ0Q29sb3Iuc3Vic3RyaW5nKCAwLCAyICksIHRoaXMuX2VuZENvbG9yLnN1YnN0cmluZyggMCwgMiApICk7XG4gICAgICAgICAgICB2YXIgZyA9IHRoaXMuY2FsY0ludCggbnVtYmVyLCB0aGlzLl9zdGFydENvbG9yLnN1YnN0cmluZyggMiwgNCApLCB0aGlzLl9lbmRDb2xvci5zdWJzdHJpbmcoIDIsIDQgKSApO1xuICAgICAgICAgICAgdmFyIGIgPSB0aGlzLmNhbGNJbnQoIG51bWJlciwgdGhpcy5fc3RhcnRDb2xvci5zdWJzdHJpbmcoIDQsIDYgKSwgdGhpcy5fZW5kQ29sb3Iuc3Vic3RyaW5nKCA0LCA2ICkgKTtcblxuICAgICAgICAgICAgaWYgKCBpblJnYiA9PT0gdHJ1ZSApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gWyByLCBnLCBiIF07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxjSGV4KCByICkgKyBjYWxjSGV4KCBnICkgKyBjYWxjSGV4KCBiICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSxcblxuICAgICAgICBjYWxjSW50OiBmdW5jdGlvbiAoIG51bWJlciwgY2hhbm5lbFN0YXJ0X0Jhc2UxNiwgY2hhbm5lbEVuZF9CYXNlMTYgKSB7XG5cbiAgICAgICAgICAgIHZhciBudW0gPSBNYXRoLm1pbiggTWF0aC5tYXgoIG51bWJlciwgdGhpcy5fbWluTnVtYmVyICksIHRoaXMuX21heE51bWJlciApO1xuICAgICAgICAgICAgdmFyIG51bVJhbmdlID0gdGhpcy5fbWF4TnVtYmVyIC0gdGhpcy5fbWluTnVtYmVyO1xuXG4gICAgICAgICAgICB2YXIgY1N0YXJ0X0Jhc2UxMCA9IHBhcnNlSW50KCBjaGFubmVsU3RhcnRfQmFzZTE2LCAxNiApO1xuICAgICAgICAgICAgdmFyIGNFbmRfQmFzZTEwID0gcGFyc2VJbnQoIGNoYW5uZWxFbmRfQmFzZTE2LCAxNiApO1xuICAgICAgICAgICAgdmFyIGNQZXJVbml0ID0gKCBjRW5kX0Jhc2UxMCAtIGNTdGFydF9CYXNlMTAgKSAvIG51bVJhbmdlO1xuICAgICAgICAgICAgdmFyIGNfQmFzZTEwID0gTWF0aC5yb3VuZCggY1BlclVuaXQgKiAoIG51bSAtIHRoaXMuX21pbk51bWJlciApICsgY1N0YXJ0X0Jhc2UxMCApO1xuXG4gICAgICAgICAgICByZXR1cm4gY19CYXNlMTA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvL1VUSUxTXG4gICAgZnVuY3Rpb24gY2FsY0hleCggaW50ZWdlciApIHtcbiAgICAgICAgcmV0dXJuIGZvcm1hdEhleCggaW50ZWdlci50b1N0cmluZyggMTYgKSApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdEhleCggaGV4ICkge1xuICAgICAgICByZXR1cm4gKCBoZXgubGVuZ3RoID09PSAxICkgPyAnMCcgKyBoZXggOiBoZXg7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0SGV4Q29sb3IoIHN0cmluZyApIHtcbiAgICAgICAgcmV0dXJuIHN0cmluZy5zdWJzdHJpbmcoIHN0cmluZy5sZW5ndGggLSA2LCBzdHJpbmcubGVuZ3RoICk7XG4gICAgfVxuXG4gICAgLy9FWFBPUlRJTkcgYXMgZ2xvYmFsIHZhciBpbiBicm93c2VyIG9mIGFzIGV4cG9ydCBpbiBub2RlXG4gICAgdmFyIHJvb3QgPSB0aGlzO1xuICAgIGlmICggdHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICBpZiAoIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzICkge1xuICAgICAgICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gUmFpbmJvdztcbiAgICAgICAgfVxuICAgICAgICBleHBvcnRzLlJhaW5ib3cgPSBSYWluYm93O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJvb3QuUmFpbmJvdyA9IFJhaW5ib3c7XG4gICAgfVxufSApKCk7XG4iLCIoIGZ1bmN0aW9uKCkge1xuXG5cdC8vZGVwZW5kZW5jaWVzXG5cdHZhciBOb2lzZSA9IHJlcXVpcmUoIFwiaW1wcm92ZWRub2lzZVwiICk7XG5cdHZhciBSYWluYm93ID0gcmVxdWlyZSggXCJyYWluYm93XCIgKTtcblxuXHR2YXIgbWluU2l6ZSA9IDU7XG5cdHZhciBtYXhTaXplID0gMjAwO1xuXG5cdHZhciBtaW5GcmVxdWVuY3kgPSAxIC8gMTAwMDtcblx0dmFyIG1heEZyZXF1ZW5jeSA9IDEgLyAzMDtcblxuXHR2YXIgbWluU3BlZWQgPSAwLjAwMTtcblx0dmFyIG1heFNwZWVkID0gMC4xO1xuXG5cdGZ1bmN0aW9uIENvbG9yZnVsTm9pc2UoIG9wdGlvbnMgKSB7XG5cblx0XHR0aGlzLl93aWR0aCA9IG1pblNpemUgKyAoIG9wdGlvbnMucXVhbGl0eSAqICggbWF4U2l6ZSAtIG1pblNpemUgKSApO1xuXHRcdHRoaXMuX2hlaWdodCA9IHRoaXMuX3dpZHRoO1xuXG5cdFx0dGhpcy5fY29sb3JzID0gb3B0aW9ucy5jb2xvcnMgfHwgWyAnI0Y5NzBGOCcsICcjRjlGQkIxJywgJyNBQUZFQTMnLCAnIzk0RkVGNycsICcjRjlGQkIxJywgJyNGOTcwRjgnIF07XG5cblx0XHR0aGlzLl9mcmVxID0gbWluRnJlcXVlbmN5ICsgKCBvcHRpb25zLmdyYW51bGFyaXR5ICogKCBtYXhGcmVxdWVuY3kgLSBtaW5GcmVxdWVuY3kgKSApO1xuXG5cdFx0dGhpcy5fc3BlZWQgPSBtaW5TcGVlZCArICggb3B0aW9ucy5zcGVlZCAqICggbWF4U3BlZWQgLSBtaW5TcGVlZCApICk7XG5cblx0XHR0aGlzLl9hbmltYXRpbmcgPSBmYWxzZTtcblxuXHRcdHRoaXMuX3ogPSAwO1xuXHRcdHRoaXMuaW5pdCgpO1xuXHR9XG5cblx0Q29sb3JmdWxOb2lzZS5wcm90b3R5cGUgPSB7XG5cblx0XHRpbml0OiBmdW5jdGlvbigpIHtcblxuXHRcdFx0dmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiY2FudmFzXCIgKTtcblx0XHRcdHZhciByYWluYm93ID0gbmV3IFJhaW5ib3coIHRoaXMuX2NvbG9ycyApO1xuXG5cdFx0XHR0aGlzLl9jYW52YXMgPSBjYW52YXM7XG5cdFx0XHR0aGlzLl9jdHggPSBjYW52YXMuZ2V0Q29udGV4dCggXCIyZFwiICk7XG5cdFx0XHR0aGlzLl9yYWluYm93ID0gcmFpbmJvdztcblxuXHRcdFx0dGhpcy5yZXNpemUoKVxuXHRcdH0sXG5cblx0XHR1cGRhdGVOb2lzZTogZnVuY3Rpb24oKSB7XG5cblx0XHRcdHZhciByYWluYm93ID0gdGhpcy5fcmFpbmJvdztcblx0XHRcdHZhciBjYW52YXMgPSB0aGlzLl9jYW52YXM7XG5cdFx0XHR2YXIgY29udGV4dCA9IHRoaXMuX2N0eDtcblx0XHRcdHZhciBmcmVxID0gdGhpcy5fZnJlcTtcblx0XHRcdHZhciB6ID0gKCB0aGlzLl96ICs9IHRoaXMuX3NwZWVkICk7XG5cdFx0XHR2YXIgcGl4ID0gY29udGV4dC5jcmVhdGVJbWFnZURhdGEoIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCApO1xuXHRcdFx0dmFyIGluYyA9IDA7XG5cdFx0XHRmb3IgKCB2YXIgeSA9IDA7IHkgPCBjYW52YXMuaGVpZ2h0OyB5KysgKSB7XG5cdFx0XHRcdGZvciAoIHZhciB4ID0gMDsgeCA8IGNhbnZhcy53aWR0aDsgeCsrICkge1xuXHRcdFx0XHRcdHZhciBuID0gTm9pc2UoIHggKiB0aGlzLl9mcmVxLCB5ICogdGhpcy5fZnJlcSwgeiApICsgLjU7XG5cdFx0XHRcdFx0Ly8gY29uc29sZS5sb2coIG4gKTtcblx0XHRcdFx0XHRuID0gTWF0aC5taW4oIE1hdGgubWF4KCAwLCBuICksIDEgKTtcblxuXHRcdFx0XHRcdHZhciByZ2IgPSByYWluYm93LmNvbG9yQXQoIG4sIHRydWUgKTtcblx0XHRcdFx0XHRwaXguZGF0YVsgaW5jKysgXSA9IHJnYlsgMCBdO1xuXHRcdFx0XHRcdHBpeC5kYXRhWyBpbmMrKyBdID0gcmdiWyAxIF07XG5cdFx0XHRcdFx0cGl4LmRhdGFbIGluYysrIF0gPSByZ2JbIDIgXTtcblx0XHRcdFx0XHRwaXguZGF0YVsgaW5jKysgXSA9IDI1NTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Y29udGV4dC5wdXRJbWFnZURhdGEoIHBpeCwgMCwgMCApO1xuXHRcdH0sXG5cblx0XHRzdGFydDogZnVuY3Rpb24oKSB7XG5cblx0XHRcdHRoaXMuX2FuaW1hdGluZyA9IHRydWU7XG5cdFx0XHR0aGlzLmFuaW1hdGUoKTtcblx0XHR9LFxuXG5cdFx0c3RhcnQ6IGZ1bmN0aW9uKCkge1xuXG5cdFx0XHR0aGlzLl9hbmltYXRpbmcgPSBmYWxzZTtcblx0XHR9LFxuXG5cdFx0YW5pbWF0ZTogZnVuY3Rpb24oKSB7XG5cblx0XHRcdGlmICggdGhpcy5fYW5pbWF0aW5nICkge1xuXHRcdFx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIHRoaXMuYW5pbWF0ZS5iaW5kKCB0aGlzICkgKTtcblx0XHRcdFx0dGhpcy51cGRhdGVOb2lzZSgpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHR1cGRhdGU6IGZ1bmN0aW9uKCkge1xuXG5cdFx0XHR0aGlzLnVwZGF0ZU5vaXNlKCk7XG5cdFx0fSxcblxuXHRcdHJlc2l6ZTogZnVuY3Rpb24oKSB7XG5cblx0XHRcdHRoaXMuX2NhbnZhcy53aWR0aCA9IHRoaXMuX3dpZHRoO1xuXHRcdFx0dGhpcy5fY2FudmFzLmhlaWdodCA9IHRoaXMuX2hlaWdodDtcblx0XHR9LFxuXG5cdFx0Z2V0Q2FudmFzOiBmdW5jdGlvbigpIHtcblxuXHRcdFx0cmV0dXJuIHRoaXMuX2NhbnZhcztcblx0XHR9XG5cdH1cblxuXHQvL2V4cG9ydGluZyBvdGhlciBsaWJyYXJpZXNcblx0Q29sb3JmdWxOb2lzZS5Ob2lzZSA9IE5vaXNlO1xuXHRDb2xvcmZ1bE5vaXNlLlJhaW5ib3cgPSBSYWluYm93O1xuXG5cdG1vZHVsZS5leHBvcnRzID0gQ29sb3JmdWxOb2lzZTtcbn0gKSgpOyJdfQ==
