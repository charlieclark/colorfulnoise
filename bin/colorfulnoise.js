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

		this._width = options.width || minSize + ( options.quality * ( maxSize - minSize ) );
		this._height = options.height || this._width;

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

			var z = ( this._z += this._speed );
			var pix = this._ctx.createImageData( this._canvas.width, this._canvas.height );

			var inc = 0,
				x = 0,
				y = 0,
				n, rgb;

			for ( y = 0; y < this._canvas.height; y++ ) {
				for ( x = 0; x < this._canvas.width; x++ ) {
					n = Noise( x * this._freq, y * this._freq, z ) + .5;

					if ( n < 0 ) {
						n = 0;
					} else if ( n > 1 ) {
						n = 1;
					}

					rgb = this._rainbow.colorAt( n, true );
					pix.data[ inc++ ] = rgb[ 0 ];
					pix.data[ inc++ ] = rgb[ 1 ];
					pix.data[ inc++ ] = rgb[ 2 ];
					pix.data[ inc++ ] = 255;
				}
			}
			this._ctx.putImageData( pix, 0, 0 );
		},

		start: function() {

			this._animating = true;
			this.animate();
		},

		stop: function() {

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9ub2RlX21vZHVsZXMvaW1wcm92ZWRub2lzZS9pbXByb3ZlZG5vaXNlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3JhaW5ib3cvcmFpbmJvdy5qcyIsIi4uL3NyYy9jb2xvcmZ1bG5vaXNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIElNUExFTUVOVEFUSU9OIE9GIElNUFJPVkVEIE5PSVNFIC0gQ09QWVJJR0hUIDIwMDIgS0VOIFBFUkxJTi5cbiggZnVuY3Rpb24oKSB7XG4gIHZhciBwID0gW107XG4gIHZhciBwZXJtdXRhdGlvbiA9IFsgMTUxLCAxNjAsIDEzNywgOTEsIDkwLCAxNSxcbiAgICAxMzEsIDEzLCAyMDEsIDk1LCA5NiwgNTMsIDE5NCwgMjMzLCA3LCAyMjUsIDE0MCwgMzYsIDEwMywgMzAsIDY5LCAxNDIsIDgsIDk5LCAzNywgMjQwLCAyMSwgMTAsIDIzLFxuICAgIDE5MCwgNiwgMTQ4LCAyNDcsIDEyMCwgMjM0LCA3NSwgMCwgMjYsIDE5NywgNjIsIDk0LCAyNTIsIDIxOSwgMjAzLCAxMTcsIDM1LCAxMSwgMzIsIDU3LCAxNzcsIDMzLFxuICAgIDg4LCAyMzcsIDE0OSwgNTYsIDg3LCAxNzQsIDIwLCAxMjUsIDEzNiwgMTcxLCAxNjgsIDY4LCAxNzUsIDc0LCAxNjUsIDcxLCAxMzQsIDEzOSwgNDgsIDI3LCAxNjYsXG4gICAgNzcsIDE0NiwgMTU4LCAyMzEsIDgzLCAxMTEsIDIyOSwgMTIyLCA2MCwgMjExLCAxMzMsIDIzMCwgMjIwLCAxMDUsIDkyLCA0MSwgNTUsIDQ2LCAyNDUsIDQwLCAyNDQsXG4gICAgMTAyLCAxNDMsIDU0LCA2NSwgMjUsIDYzLCAxNjEsIDEsIDIxNiwgODAsIDczLCAyMDksIDc2LCAxMzIsIDE4NywgMjA4LCA4OSwgMTgsIDE2OSwgMjAwLCAxOTYsXG4gICAgMTM1LCAxMzAsIDExNiwgMTg4LCAxNTksIDg2LCAxNjQsIDEwMCwgMTA5LCAxOTgsIDE3MywgMTg2LCAzLCA2NCwgNTIsIDIxNywgMjI2LCAyNTAsIDEyNCwgMTIzLFxuICAgIDUsIDIwMiwgMzgsIDE0NywgMTE4LCAxMjYsIDI1NSwgODIsIDg1LCAyMTIsIDIwNywgMjA2LCA1OSwgMjI3LCA0NywgMTYsIDU4LCAxNywgMTgyLCAxODksIDI4LCA0MixcbiAgICAyMjMsIDE4MywgMTcwLCAyMTMsIDExOSwgMjQ4LCAxNTIsIDIsIDQ0LCAxNTQsIDE2MywgNzAsIDIyMSwgMTUzLCAxMDEsIDE1NSwgMTY3LCA0MywgMTcyLCA5LFxuICAgIDEyOSwgMjIsIDM5LCAyNTMsIDE5LCA5OCwgMTA4LCAxMTAsIDc5LCAxMTMsIDIyNCwgMjMyLCAxNzgsIDE4NSwgMTEyLCAxMDQsIDIxOCwgMjQ2LCA5NywgMjI4LFxuICAgIDI1MSwgMzQsIDI0MiwgMTkzLCAyMzgsIDIxMCwgMTQ0LCAxMiwgMTkxLCAxNzksIDE2MiwgMjQxLCA4MSwgNTEsIDE0NSwgMjM1LCAyNDksIDE0LCAyMzksIDEwNyxcbiAgICA0OSwgMTkyLCAyMTQsIDMxLCAxODEsIDE5OSwgMTA2LCAxNTcsIDE4NCwgODQsIDIwNCwgMTc2LCAxMTUsIDEyMSwgNTAsIDQ1LCAxMjcsIDQsIDE1MCwgMjU0LFxuICAgIDEzOCwgMjM2LCAyMDUsIDkzLCAyMjIsIDExNCwgNjcsIDI5LCAyNCwgNzIsIDI0MywgMTQxLCAxMjgsIDE5NSwgNzgsIDY2LCAyMTUsIDYxLCAxNTYsIDE4MFxuICBdO1xuXG4gIGZvciAoIHZhciBpID0gMDsgaSA8IDI1NjsgaSsrIClcbiAgICBwWyAyNTYgKyBpIF0gPSBwWyBpIF0gPSBwZXJtdXRhdGlvblsgaSBdO1xuXG4gIGZ1bmN0aW9uIE5vaXNlKCB4LCB5LCB6ICkge1xuICAgIHZhciBYID0gTWF0aC5mbG9vciggeCApICYgMjU1LFxuICAgICAgWSA9IE1hdGguZmxvb3IoIHkgKSAmIDI1NSxcbiAgICAgIFogPSBNYXRoLmZsb29yKCB6ICkgJiAyNTU7XG4gICAgeCAtPSBNYXRoLmZsb29yKCB4ICk7XG4gICAgeSAtPSBNYXRoLmZsb29yKCB5ICk7XG4gICAgeiAtPSBNYXRoLmZsb29yKCB6ICk7XG5cbiAgICB2YXIgdSA9IGZhZGUoIHggKSxcbiAgICAgIHYgPSBmYWRlKCB5ICksXG4gICAgICB3ID0gZmFkZSggeiApO1xuICAgIHZhciBBID0gcFsgWCBdICsgWSxcbiAgICAgIEFBID0gcFsgQSBdICsgWixcbiAgICAgIEFCID0gcFsgQSArIDEgXSArIFosXG4gICAgICBCID0gcFsgWCArIDEgXSArIFksXG4gICAgICBCQSA9IHBbIEIgXSArIFosXG4gICAgICBCQiA9IHBbIEIgKyAxIF0gKyBaO1xuXG4gICAgcmV0dXJuIGxlcnAoIHcsIGxlcnAoIHYsIGxlcnAoIHUsIGdyYWQoIHBbIEFBIF0sIHgsIHksIHogKSxcbiAgICAgICAgICBncmFkKCBwWyBCQSBdLCB4IC0gMSwgeSwgeiApICksXG4gICAgICAgIGxlcnAoIHUsIGdyYWQoIHBbIEFCIF0sIHgsIHkgLSAxLCB6ICksXG4gICAgICAgICAgZ3JhZCggcFsgQkIgXSwgeCAtIDEsIHkgLSAxLCB6ICkgKSApLFxuICAgICAgbGVycCggdiwgbGVycCggdSwgZ3JhZCggcFsgQUEgKyAxIF0sIHgsIHksIHogLSAxICksXG4gICAgICAgICAgZ3JhZCggcFsgQkEgKyAxIF0sIHggLSAxLCB5LCB6IC0gMSApICksXG4gICAgICAgIGxlcnAoIHUsIGdyYWQoIHBbIEFCICsgMSBdLCB4LCB5IC0gMSwgeiAtIDEgKSxcbiAgICAgICAgICBncmFkKCBwWyBCQiArIDEgXSwgeCAtIDEsIHkgLSAxLCB6IC0gMSApICkgKSApO1xuICB9XG5cbiAgZnVuY3Rpb24gZmFkZSggdCApIHtcbiAgICByZXR1cm4gdCAqIHQgKiB0ICogKCB0ICogKCB0ICogNiAtIDE1ICkgKyAxMCApO1xuICB9XG5cbiAgZnVuY3Rpb24gbGVycCggdCwgYSwgYiApIHtcbiAgICByZXR1cm4gYSArIHQgKiAoIGIgLSBhICk7XG4gIH1cblxuICBmdW5jdGlvbiBncmFkKCBoYXNoLCB4LCB5LCB6ICkge1xuICAgIHZhciBoID0gaGFzaCAmIDE1O1xuICAgIHZhciB1ID0gaCA8IDggPyB4IDogeSxcbiAgICAgIHYgPSBoIDwgNCA/IHkgOiBoID09IDEyIHx8IGggPT0gMTQgPyB4IDogejtcbiAgICByZXR1cm4gKCAoIGggJiAxICkgPT0gMCA/IHUgOiAtdSApICsgKCAoIGggJiAyICkgPT0gMCA/IHYgOiAtdiApO1xuICB9XG5cbiAgLy9FWFBPUlRJTkcgYXMgZ2xvYmFsIHZhciBpbiBicm93c2VyIG9yIGFzIGV4cG9ydCBpbiBub2RlXG4gIGlmICggdHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnICkge1xuICAgIGlmICggdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMgKSB7XG4gICAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBOb2lzZTtcbiAgICB9XG4gICAgZXhwb3J0cy5Ob2lzZSA9IE5vaXNlO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuTm9pc2UgPSBOb2lzZTtcbiAgfVxufSApKCk7IiwiKCBmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgbnVtUmFuZ2UgPSAxMDA7XG5cbiAgICAvL1JBSU5CT1cgQ0xBU1NcbiAgICBmdW5jdGlvbiBSYWluYm93KCBzcGVjdHJ1bSApIHtcblxuICAgICAgICB0aGlzLl9ncmFkaWVudHMgPSBudWxsO1xuICAgICAgICB0aGlzLl9jb2xvcnMgPSBudWxsO1xuICAgICAgICB0aGlzLnNldENvbG9ycyggc3BlY3RydW0gKTtcbiAgICB9XG5cbiAgICBSYWluYm93LnByb3RvdHlwZSA9IHtcblxuICAgICAgICBzZXRDb2xvcnM6IGZ1bmN0aW9uICggc3BlY3RydW0gKSB7XG5cbiAgICAgICAgICAgIHZhciBpbmNyZW1lbnQgPSB0aGlzLl9zZWdtZW50TGVuZ3RoID0gbnVtUmFuZ2UgLyAoIHNwZWN0cnVtLmxlbmd0aCAtIDEgKTtcblxuICAgICAgICAgICAgdGhpcy5fZ3JhZGllbnRzID0gW107XG5cbiAgICAgICAgICAgIGZvciAoIHZhciBpID0gMDsgaSA8IHNwZWN0cnVtLmxlbmd0aCAtIDE7IGkrKyApIHtcbiAgICAgICAgICAgICAgICB2YXIgY29sb3JHcmFkaWVudCA9IG5ldyBDb2xvckdyYWRpZW50KFxuICAgICAgICAgICAgICAgICAgICBzcGVjdHJ1bVsgaSBdLFxuICAgICAgICAgICAgICAgICAgICBzcGVjdHJ1bVsgaSArIDEgXSxcbiAgICAgICAgICAgICAgICAgICAgaW5jcmVtZW50ICogaSxcbiAgICAgICAgICAgICAgICAgICAgaW5jcmVtZW50ICogKCBpICsgMSApXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9ncmFkaWVudHNbIGkgXSA9IGNvbG9yR3JhZGllbnQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2NvbG9ycyA9IHNwZWN0cnVtO1xuXG4gICAgICAgIH0sXG5cbiAgICAgICAgY29sb3JBdDogZnVuY3Rpb24gKCByYXRpbywgaW5SZ2IgKSB7XG5cbiAgICAgICAgICAgIHZhciBudW1iZXIgPSByYXRpbyAqIG51bVJhbmdlO1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gTWF0aC5taW4oIE1hdGguZmxvb3IoIG51bWJlciAvIHRoaXMuX3NlZ21lbnRMZW5ndGggKSwgdGhpcy5fZ3JhZGllbnRzLmxlbmd0aCAtIDEgKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ncmFkaWVudHNbIGluZGV4IF0uY29sb3JBdCggbnVtYmVyLCBpblJnYiApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy9DT0xPUiBHUkFESUVOVCBDTEFTU1xuICAgIGZ1bmN0aW9uIENvbG9yR3JhZGllbnQoIGNvbG9yU3RhcnQsIGNvbG9yRW5kLCBtaW5OdW1iZXIsIG1heE51bWJlciApIHtcblxuICAgICAgICB0aGlzLl9zdGFydENvbG9yID0gZ2V0SGV4Q29sb3IoIGNvbG9yU3RhcnQgKTtcbiAgICAgICAgdGhpcy5fZW5kQ29sb3IgPSBnZXRIZXhDb2xvciggY29sb3JFbmQgKTtcbiAgICAgICAgdGhpcy5fbWluTnVtYmVyID0gbWluTnVtYmVyO1xuICAgICAgICB0aGlzLl9tYXhOdW1iZXIgPSBtYXhOdW1iZXI7XG4gICAgfVxuXG4gICAgQ29sb3JHcmFkaWVudC5wcm90b3R5cGUgPSB7XG5cbiAgICAgICAgY29sb3JBdDogZnVuY3Rpb24gKCBudW1iZXIsIGluUmdiICkge1xuXG4gICAgICAgICAgICB2YXIgciA9IHRoaXMuY2FsY0ludCggbnVtYmVyLCB0aGlzLl9zdGFydENvbG9yLnN1YnN0cmluZyggMCwgMiApLCB0aGlzLl9lbmRDb2xvci5zdWJzdHJpbmcoIDAsIDIgKSApO1xuICAgICAgICAgICAgdmFyIGcgPSB0aGlzLmNhbGNJbnQoIG51bWJlciwgdGhpcy5fc3RhcnRDb2xvci5zdWJzdHJpbmcoIDIsIDQgKSwgdGhpcy5fZW5kQ29sb3Iuc3Vic3RyaW5nKCAyLCA0ICkgKTtcbiAgICAgICAgICAgIHZhciBiID0gdGhpcy5jYWxjSW50KCBudW1iZXIsIHRoaXMuX3N0YXJ0Q29sb3Iuc3Vic3RyaW5nKCA0LCA2ICksIHRoaXMuX2VuZENvbG9yLnN1YnN0cmluZyggNCwgNiApICk7XG5cbiAgICAgICAgICAgIGlmICggaW5SZ2IgPT09IHRydWUgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsgciwgZywgYiBdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsY0hleCggciApICsgY2FsY0hleCggZyApICsgY2FsY0hleCggYiApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0sXG5cbiAgICAgICAgY2FsY0ludDogZnVuY3Rpb24gKCBudW1iZXIsIGNoYW5uZWxTdGFydF9CYXNlMTYsIGNoYW5uZWxFbmRfQmFzZTE2ICkge1xuXG4gICAgICAgICAgICB2YXIgbnVtID0gTWF0aC5taW4oIE1hdGgubWF4KCBudW1iZXIsIHRoaXMuX21pbk51bWJlciApLCB0aGlzLl9tYXhOdW1iZXIgKTtcbiAgICAgICAgICAgIHZhciBudW1SYW5nZSA9IHRoaXMuX21heE51bWJlciAtIHRoaXMuX21pbk51bWJlcjtcblxuICAgICAgICAgICAgdmFyIGNTdGFydF9CYXNlMTAgPSBwYXJzZUludCggY2hhbm5lbFN0YXJ0X0Jhc2UxNiwgMTYgKTtcbiAgICAgICAgICAgIHZhciBjRW5kX0Jhc2UxMCA9IHBhcnNlSW50KCBjaGFubmVsRW5kX0Jhc2UxNiwgMTYgKTtcbiAgICAgICAgICAgIHZhciBjUGVyVW5pdCA9ICggY0VuZF9CYXNlMTAgLSBjU3RhcnRfQmFzZTEwICkgLyBudW1SYW5nZTtcbiAgICAgICAgICAgIHZhciBjX0Jhc2UxMCA9IE1hdGgucm91bmQoIGNQZXJVbml0ICogKCBudW0gLSB0aGlzLl9taW5OdW1iZXIgKSArIGNTdGFydF9CYXNlMTAgKTtcblxuICAgICAgICAgICAgcmV0dXJuIGNfQmFzZTEwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy9VVElMU1xuICAgIGZ1bmN0aW9uIGNhbGNIZXgoIGludGVnZXIgKSB7XG4gICAgICAgIHJldHVybiBmb3JtYXRIZXgoIGludGVnZXIudG9TdHJpbmcoIDE2ICkgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXRIZXgoIGhleCApIHtcbiAgICAgICAgcmV0dXJuICggaGV4Lmxlbmd0aCA9PT0gMSApID8gJzAnICsgaGV4IDogaGV4O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEhleENvbG9yKCBzdHJpbmcgKSB7XG4gICAgICAgIHJldHVybiBzdHJpbmcuc3Vic3RyaW5nKCBzdHJpbmcubGVuZ3RoIC0gNiwgc3RyaW5nLmxlbmd0aCApO1xuICAgIH1cblxuICAgIC8vRVhQT1JUSU5HIGFzIGdsb2JhbCB2YXIgaW4gYnJvd3NlciBvZiBhcyBleHBvcnQgaW4gbm9kZVxuICAgIHZhciByb290ID0gdGhpcztcbiAgICBpZiAoIHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgaWYgKCB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cyApIHtcbiAgICAgICAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IFJhaW5ib3c7XG4gICAgICAgIH1cbiAgICAgICAgZXhwb3J0cy5SYWluYm93ID0gUmFpbmJvdztcbiAgICB9IGVsc2Uge1xuICAgICAgICByb290LlJhaW5ib3cgPSBSYWluYm93O1xuICAgIH1cbn0gKSgpO1xuIiwiKCBmdW5jdGlvbigpIHtcblxuXHQvL2RlcGVuZGVuY2llc1xuXHR2YXIgTm9pc2UgPSByZXF1aXJlKCBcImltcHJvdmVkbm9pc2VcIiApO1xuXHR2YXIgUmFpbmJvdyA9IHJlcXVpcmUoIFwicmFpbmJvd1wiICk7XG5cblx0dmFyIG1pblNpemUgPSA1O1xuXHR2YXIgbWF4U2l6ZSA9IDIwMDtcblxuXHR2YXIgbWluRnJlcXVlbmN5ID0gMSAvIDEwMDA7XG5cdHZhciBtYXhGcmVxdWVuY3kgPSAxIC8gMzA7XG5cblx0dmFyIG1pblNwZWVkID0gMC4wMDE7XG5cdHZhciBtYXhTcGVlZCA9IDAuMTtcblxuXHRmdW5jdGlvbiBDb2xvcmZ1bE5vaXNlKCBvcHRpb25zICkge1xuXG5cdFx0dGhpcy5fd2lkdGggPSBvcHRpb25zLndpZHRoIHx8IG1pblNpemUgKyAoIG9wdGlvbnMucXVhbGl0eSAqICggbWF4U2l6ZSAtIG1pblNpemUgKSApO1xuXHRcdHRoaXMuX2hlaWdodCA9IG9wdGlvbnMuaGVpZ2h0IHx8IHRoaXMuX3dpZHRoO1xuXG5cdFx0dGhpcy5fY29sb3JzID0gb3B0aW9ucy5jb2xvcnMgfHwgWyAnI0Y5NzBGOCcsICcjRjlGQkIxJywgJyNBQUZFQTMnLCAnIzk0RkVGNycsICcjRjlGQkIxJywgJyNGOTcwRjgnIF07XG5cblx0XHR0aGlzLl9mcmVxID0gbWluRnJlcXVlbmN5ICsgKCBvcHRpb25zLmdyYW51bGFyaXR5ICogKCBtYXhGcmVxdWVuY3kgLSBtaW5GcmVxdWVuY3kgKSApO1xuXG5cdFx0dGhpcy5fc3BlZWQgPSBtaW5TcGVlZCArICggb3B0aW9ucy5zcGVlZCAqICggbWF4U3BlZWQgLSBtaW5TcGVlZCApICk7XG5cblx0XHR0aGlzLl9hbmltYXRpbmcgPSBmYWxzZTtcblxuXHRcdHRoaXMuX3ogPSAwO1xuXHRcdHRoaXMuaW5pdCgpO1xuXHR9XG5cblx0Q29sb3JmdWxOb2lzZS5wcm90b3R5cGUgPSB7XG5cblx0XHRpbml0OiBmdW5jdGlvbigpIHtcblxuXHRcdFx0dmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiY2FudmFzXCIgKTtcblx0XHRcdHZhciByYWluYm93ID0gbmV3IFJhaW5ib3coIHRoaXMuX2NvbG9ycyApO1xuXG5cdFx0XHR0aGlzLl9jYW52YXMgPSBjYW52YXM7XG5cdFx0XHR0aGlzLl9jdHggPSBjYW52YXMuZ2V0Q29udGV4dCggXCIyZFwiICk7XG5cdFx0XHR0aGlzLl9yYWluYm93ID0gcmFpbmJvdztcblxuXHRcdFx0dGhpcy5yZXNpemUoKVxuXHRcdH0sXG5cblx0XHR1cGRhdGVOb2lzZTogZnVuY3Rpb24oKSB7XG5cblx0XHRcdHZhciB6ID0gKCB0aGlzLl96ICs9IHRoaXMuX3NwZWVkICk7XG5cdFx0XHR2YXIgcGl4ID0gdGhpcy5fY3R4LmNyZWF0ZUltYWdlRGF0YSggdGhpcy5fY2FudmFzLndpZHRoLCB0aGlzLl9jYW52YXMuaGVpZ2h0ICk7XG5cblx0XHRcdHZhciBpbmMgPSAwLFxuXHRcdFx0XHR4ID0gMCxcblx0XHRcdFx0eSA9IDAsXG5cdFx0XHRcdG4sIHJnYjtcblxuXHRcdFx0Zm9yICggeSA9IDA7IHkgPCB0aGlzLl9jYW52YXMuaGVpZ2h0OyB5KysgKSB7XG5cdFx0XHRcdGZvciAoIHggPSAwOyB4IDwgdGhpcy5fY2FudmFzLndpZHRoOyB4KysgKSB7XG5cdFx0XHRcdFx0biA9IE5vaXNlKCB4ICogdGhpcy5fZnJlcSwgeSAqIHRoaXMuX2ZyZXEsIHogKSArIC41O1xuXG5cdFx0XHRcdFx0aWYgKCBuIDwgMCApIHtcblx0XHRcdFx0XHRcdG4gPSAwO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoIG4gPiAxICkge1xuXHRcdFx0XHRcdFx0biA9IDE7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmdiID0gdGhpcy5fcmFpbmJvdy5jb2xvckF0KCBuLCB0cnVlICk7XG5cdFx0XHRcdFx0cGl4LmRhdGFbIGluYysrIF0gPSByZ2JbIDAgXTtcblx0XHRcdFx0XHRwaXguZGF0YVsgaW5jKysgXSA9IHJnYlsgMSBdO1xuXHRcdFx0XHRcdHBpeC5kYXRhWyBpbmMrKyBdID0gcmdiWyAyIF07XG5cdFx0XHRcdFx0cGl4LmRhdGFbIGluYysrIF0gPSAyNTU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHRoaXMuX2N0eC5wdXRJbWFnZURhdGEoIHBpeCwgMCwgMCApO1xuXHRcdH0sXG5cblx0XHRzdGFydDogZnVuY3Rpb24oKSB7XG5cblx0XHRcdHRoaXMuX2FuaW1hdGluZyA9IHRydWU7XG5cdFx0XHR0aGlzLmFuaW1hdGUoKTtcblx0XHR9LFxuXG5cdFx0c3RvcDogZnVuY3Rpb24oKSB7XG5cblx0XHRcdHRoaXMuX2FuaW1hdGluZyA9IGZhbHNlO1xuXHRcdH0sXG5cblx0XHRhbmltYXRlOiBmdW5jdGlvbigpIHtcblxuXHRcdFx0aWYgKCB0aGlzLl9hbmltYXRpbmcgKSB7XG5cdFx0XHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZSggdGhpcy5hbmltYXRlLmJpbmQoIHRoaXMgKSApO1xuXHRcdFx0XHR0aGlzLnVwZGF0ZU5vaXNlKCk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdHVwZGF0ZTogZnVuY3Rpb24oKSB7XG5cblx0XHRcdHRoaXMudXBkYXRlTm9pc2UoKTtcblx0XHR9LFxuXG5cdFx0cmVzaXplOiBmdW5jdGlvbigpIHtcblxuXHRcdFx0dGhpcy5fY2FudmFzLndpZHRoID0gdGhpcy5fd2lkdGg7XG5cdFx0XHR0aGlzLl9jYW52YXMuaGVpZ2h0ID0gdGhpcy5faGVpZ2h0O1xuXHRcdH0sXG5cblx0XHRnZXRDYW52YXM6IGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5fY2FudmFzO1xuXHRcdH1cblx0fVxuXG5cdC8vZXhwb3J0aW5nIG90aGVyIGxpYnJhcmllc1xuXHRDb2xvcmZ1bE5vaXNlLk5vaXNlID0gTm9pc2U7XG5cdENvbG9yZnVsTm9pc2UuUmFpbmJvdyA9IFJhaW5ib3c7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBDb2xvcmZ1bE5vaXNlO1xufSApKCk7Il19
