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
( function() {

    var numRange = 100;

    //RAINBOW CLASS
    function Rainbow( spectrum ) {

        this._gradients = null;
        this._colors = null;
        this.setColors( spectrum );
    }

    Rainbow.prototype = {

        setColors: function( spectrum ) {

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

        colorAt: function( ratio, inRgb ) {

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
        this._range = this._maxNumber - this._minNumber;
    }

    ColorGradient.prototype = {

        colorAt: function( number, inRgb ) {

            var r = this.calcInt( number, this._startColor.substring( 0, 2 ), this._endColor.substring( 0, 2 ) );
            var g = this.calcInt( number, this._startColor.substring( 2, 4 ), this._endColor.substring( 2, 4 ) );
            var b = this.calcInt( number, this._startColor.substring( 4, 6 ), this._endColor.substring( 4, 6 ) );

            if ( inRgb ) {
                return [ r, g, b ];
            } else {
                return calcHex( r ) + calcHex( g ) + calcHex( b );
            }

        },

        calcInt: function( number, channelStart_Base16, channelEnd_Base16 ) {

            var num = number;

            if ( number < this._minNumber ) {
                num = this._minNumber;
            } else if ( number > this._maxNumber ) {
                num = this._maxNumber;
            }

            var cStart_Base10 = parseInt( channelStart_Base16, 16 );
            var cEnd_Base10 = parseInt( channelEnd_Base16, 16 );
            var cPerUnit = ( cEnd_Base10 - cStart_Base10 ) / this._range;
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

	var fps = 1000 / 60;
	var defaultTransitionTime = 5;

	function ColorfulNoise( options ) {

		this._width = options.width || minSize + ( options.quality * ( maxSize - minSize ) );
		this._height = options.height || this._width;

		this._colors = options.colors || [ '#F970F8', '#F9FBB1', '#AAFEA3', '#94FEF7', '#F9FBB1', '#F970F8' ];

		this._freq = minFrequency + ( options.granularity * ( maxFrequency - minFrequency ) );

		this._speed = minSpeed + ( options.speed * ( maxSpeed - minSpeed ) );

		this._animating = false;

		this._hasCanvas = options.hasCanvas;

		this._colorData = [];

		this._z = 0;
		this.init();
	}

	ColorfulNoise.prototype = {

		init: function() {

			if ( this._hasCanvas ) {
				this._canvas = document.createElement( "canvas" );
				this._ctx = this._canvas.getContext( "2d" );
			}

			this._rainbow = new Rainbow( this._colors );
			this.resize()
		},

		updateNoise: function() {

			if ( this._toRainbow ) {
				this.updateToRainbow();
			}

			var z = ( this._z += this._speed );

			if ( this._hasCanvas ) {
				var pix = this._ctx.createImageData( this._canvas.width, this._canvas.height );
				var data = this._colorData = pix.data;
			} else {
				var data = this._colorData;
			}

			var inc = 0,
				x = 0,
				y = 0,
				n, rgb;

			for ( y = 0; y < this._height; y++ ) {
				for ( x = 0; x < this._width; x++ ) {
					n = Noise( x * this._freq, y * this._freq, z ) + .5;

					if ( n < 0 ) {
						n = 0;
					} else if ( n > 1 ) {
						n = 1;
					}

					rgb = this._rainbow.colorAt( n, true );

					if ( this._toRainbow ) {
						rgb2 = this._toRainbow.colorAt( n, true );
						rgb = this.blendColors( rgb, rgb2, this._toRainbowRatio );
					}

					data[ inc++ ] = rgb[ 0 ];
					data[ inc++ ] = rgb[ 1 ];
					data[ inc++ ] = rgb[ 2 ];
					data[ inc++ ] = 255;
				}
			}

			if ( this._hasCanvas ) {
				this._ctx.putImageData( pix, 0, 0 );
			}
		},

		blendColors: function( oldColor, newColor, ratio ) {

			var r = oldColor[ 0 ] + ( newColor[ 0 ] - oldColor[ 0 ] ) * ratio;
			var g = oldColor[ 1 ] + ( newColor[ 1 ] - oldColor[ 1 ] ) * ratio;
			var b = oldColor[ 2 ] + ( newColor[ 2 ] - oldColor[ 2 ] ) * ratio;
			return [ r, g, b ];
		},

		updateRainbow: function( colorArray, transitionTime ) {

			this._transitionTime = isNaN( transitionTime ) ? defaultTransitionTime : transitionTime;
			this._ticker = 0;
			this._toRainbow = new Rainbow( colorArray );
		},

		updateToRainbow: function() {

			this._ticker++;
			this._toRainbowRatio = ( this._ticker / ( this._transitionTime * fps ) );

			if ( this._toRainbowRatio >= 1 ) {
				this._rainbow = this._toRainbow;
				this._toRainbow = null;
			}
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

			if ( this._hasCanvas ) {
				this._canvas.width = this._width;
				this._canvas.height = this._height;
			}
		},

		getCanvas: function() {

			return this._canvas;
		},

		getData: function() {

			return this._colorData;
		},

		getColorAt: function( x, y ) {

			var index = ( y * this._width + x ) * 3;

			return [
				this._colorData[ index ],
				this._colorData[ index + 1 ],
				this._colorData[ index + 2 ]
			];
		}
	}

	//exporting other libraries
	ColorfulNoise.Noise = Noise;
	ColorfulNoise.Rainbow = Rainbow;

	module.exports = ColorfulNoise;
} )();
},{"improvednoise":1,"rainbow":2}]},{},[3])(3)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9ub2RlX21vZHVsZXMvaW1wcm92ZWRub2lzZS9pbXByb3ZlZG5vaXNlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3JhaW5ib3cvcmFpbmJvdy5qcyIsIi4uL3NyYy9jb2xvcmZ1bG5vaXNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBJTVBMRU1FTlRBVElPTiBPRiBJTVBST1ZFRCBOT0lTRSAtIENPUFlSSUdIVCAyMDAyIEtFTiBQRVJMSU4uXG4oIGZ1bmN0aW9uKCkge1xuICB2YXIgcCA9IFtdO1xuICB2YXIgcGVybXV0YXRpb24gPSBbIDE1MSwgMTYwLCAxMzcsIDkxLCA5MCwgMTUsXG4gICAgMTMxLCAxMywgMjAxLCA5NSwgOTYsIDUzLCAxOTQsIDIzMywgNywgMjI1LCAxNDAsIDM2LCAxMDMsIDMwLCA2OSwgMTQyLCA4LCA5OSwgMzcsIDI0MCwgMjEsIDEwLCAyMyxcbiAgICAxOTAsIDYsIDE0OCwgMjQ3LCAxMjAsIDIzNCwgNzUsIDAsIDI2LCAxOTcsIDYyLCA5NCwgMjUyLCAyMTksIDIwMywgMTE3LCAzNSwgMTEsIDMyLCA1NywgMTc3LCAzMyxcbiAgICA4OCwgMjM3LCAxNDksIDU2LCA4NywgMTc0LCAyMCwgMTI1LCAxMzYsIDE3MSwgMTY4LCA2OCwgMTc1LCA3NCwgMTY1LCA3MSwgMTM0LCAxMzksIDQ4LCAyNywgMTY2LFxuICAgIDc3LCAxNDYsIDE1OCwgMjMxLCA4MywgMTExLCAyMjksIDEyMiwgNjAsIDIxMSwgMTMzLCAyMzAsIDIyMCwgMTA1LCA5MiwgNDEsIDU1LCA0NiwgMjQ1LCA0MCwgMjQ0LFxuICAgIDEwMiwgMTQzLCA1NCwgNjUsIDI1LCA2MywgMTYxLCAxLCAyMTYsIDgwLCA3MywgMjA5LCA3NiwgMTMyLCAxODcsIDIwOCwgODksIDE4LCAxNjksIDIwMCwgMTk2LFxuICAgIDEzNSwgMTMwLCAxMTYsIDE4OCwgMTU5LCA4NiwgMTY0LCAxMDAsIDEwOSwgMTk4LCAxNzMsIDE4NiwgMywgNjQsIDUyLCAyMTcsIDIyNiwgMjUwLCAxMjQsIDEyMyxcbiAgICA1LCAyMDIsIDM4LCAxNDcsIDExOCwgMTI2LCAyNTUsIDgyLCA4NSwgMjEyLCAyMDcsIDIwNiwgNTksIDIyNywgNDcsIDE2LCA1OCwgMTcsIDE4MiwgMTg5LCAyOCwgNDIsXG4gICAgMjIzLCAxODMsIDE3MCwgMjEzLCAxMTksIDI0OCwgMTUyLCAyLCA0NCwgMTU0LCAxNjMsIDcwLCAyMjEsIDE1MywgMTAxLCAxNTUsIDE2NywgNDMsIDE3MiwgOSxcbiAgICAxMjksIDIyLCAzOSwgMjUzLCAxOSwgOTgsIDEwOCwgMTEwLCA3OSwgMTEzLCAyMjQsIDIzMiwgMTc4LCAxODUsIDExMiwgMTA0LCAyMTgsIDI0NiwgOTcsIDIyOCxcbiAgICAyNTEsIDM0LCAyNDIsIDE5MywgMjM4LCAyMTAsIDE0NCwgMTIsIDE5MSwgMTc5LCAxNjIsIDI0MSwgODEsIDUxLCAxNDUsIDIzNSwgMjQ5LCAxNCwgMjM5LCAxMDcsXG4gICAgNDksIDE5MiwgMjE0LCAzMSwgMTgxLCAxOTksIDEwNiwgMTU3LCAxODQsIDg0LCAyMDQsIDE3NiwgMTE1LCAxMjEsIDUwLCA0NSwgMTI3LCA0LCAxNTAsIDI1NCxcbiAgICAxMzgsIDIzNiwgMjA1LCA5MywgMjIyLCAxMTQsIDY3LCAyOSwgMjQsIDcyLCAyNDMsIDE0MSwgMTI4LCAxOTUsIDc4LCA2NiwgMjE1LCA2MSwgMTU2LCAxODBcbiAgXTtcblxuICBmb3IgKCB2YXIgaSA9IDA7IGkgPCAyNTY7IGkrKyApXG4gICAgcFsgMjU2ICsgaSBdID0gcFsgaSBdID0gcGVybXV0YXRpb25bIGkgXTtcblxuICBmdW5jdGlvbiBOb2lzZSggeCwgeSwgeiApIHtcbiAgICB2YXIgWCA9IE1hdGguZmxvb3IoIHggKSAmIDI1NSxcbiAgICAgIFkgPSBNYXRoLmZsb29yKCB5ICkgJiAyNTUsXG4gICAgICBaID0gTWF0aC5mbG9vciggeiApICYgMjU1O1xuICAgIHggLT0gTWF0aC5mbG9vciggeCApO1xuICAgIHkgLT0gTWF0aC5mbG9vciggeSApO1xuICAgIHogLT0gTWF0aC5mbG9vciggeiApO1xuXG4gICAgdmFyIHUgPSBmYWRlKCB4ICksXG4gICAgICB2ID0gZmFkZSggeSApLFxuICAgICAgdyA9IGZhZGUoIHogKTtcbiAgICB2YXIgQSA9IHBbIFggXSArIFksXG4gICAgICBBQSA9IHBbIEEgXSArIFosXG4gICAgICBBQiA9IHBbIEEgKyAxIF0gKyBaLFxuICAgICAgQiA9IHBbIFggKyAxIF0gKyBZLFxuICAgICAgQkEgPSBwWyBCIF0gKyBaLFxuICAgICAgQkIgPSBwWyBCICsgMSBdICsgWjtcblxuICAgIHJldHVybiBsZXJwKCB3LCBsZXJwKCB2LCBsZXJwKCB1LCBncmFkKCBwWyBBQSBdLCB4LCB5LCB6ICksXG4gICAgICAgICAgZ3JhZCggcFsgQkEgXSwgeCAtIDEsIHksIHogKSApLFxuICAgICAgICBsZXJwKCB1LCBncmFkKCBwWyBBQiBdLCB4LCB5IC0gMSwgeiApLFxuICAgICAgICAgIGdyYWQoIHBbIEJCIF0sIHggLSAxLCB5IC0gMSwgeiApICkgKSxcbiAgICAgIGxlcnAoIHYsIGxlcnAoIHUsIGdyYWQoIHBbIEFBICsgMSBdLCB4LCB5LCB6IC0gMSApLFxuICAgICAgICAgIGdyYWQoIHBbIEJBICsgMSBdLCB4IC0gMSwgeSwgeiAtIDEgKSApLFxuICAgICAgICBsZXJwKCB1LCBncmFkKCBwWyBBQiArIDEgXSwgeCwgeSAtIDEsIHogLSAxICksXG4gICAgICAgICAgZ3JhZCggcFsgQkIgKyAxIF0sIHggLSAxLCB5IC0gMSwgeiAtIDEgKSApICkgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZhZGUoIHQgKSB7XG4gICAgcmV0dXJuIHQgKiB0ICogdCAqICggdCAqICggdCAqIDYgLSAxNSApICsgMTAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxlcnAoIHQsIGEsIGIgKSB7XG4gICAgcmV0dXJuIGEgKyB0ICogKCBiIC0gYSApO1xuICB9XG5cbiAgZnVuY3Rpb24gZ3JhZCggaGFzaCwgeCwgeSwgeiApIHtcbiAgICB2YXIgaCA9IGhhc2ggJiAxNTtcbiAgICB2YXIgdSA9IGggPCA4ID8geCA6IHksXG4gICAgICB2ID0gaCA8IDQgPyB5IDogaCA9PSAxMiB8fCBoID09IDE0ID8geCA6IHo7XG4gICAgcmV0dXJuICggKCBoICYgMSApID09IDAgPyB1IDogLXUgKSArICggKCBoICYgMiApID09IDAgPyB2IDogLXYgKTtcbiAgfVxuXG4gIC8vRVhQT1JUSU5HIGFzIGdsb2JhbCB2YXIgaW4gYnJvd3NlciBvciBhcyBleHBvcnQgaW4gbm9kZVxuICBpZiAoIHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICBpZiAoIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzICkge1xuICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gTm9pc2U7XG4gICAgfVxuICAgIGV4cG9ydHMuTm9pc2UgPSBOb2lzZTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLk5vaXNlID0gTm9pc2U7XG4gIH1cbn0gKSgpOyIsIiggZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgbnVtUmFuZ2UgPSAxMDA7XG5cbiAgICAvL1JBSU5CT1cgQ0xBU1NcbiAgICBmdW5jdGlvbiBSYWluYm93KCBzcGVjdHJ1bSApIHtcblxuICAgICAgICB0aGlzLl9ncmFkaWVudHMgPSBudWxsO1xuICAgICAgICB0aGlzLl9jb2xvcnMgPSBudWxsO1xuICAgICAgICB0aGlzLnNldENvbG9ycyggc3BlY3RydW0gKTtcbiAgICB9XG5cbiAgICBSYWluYm93LnByb3RvdHlwZSA9IHtcblxuICAgICAgICBzZXRDb2xvcnM6IGZ1bmN0aW9uKCBzcGVjdHJ1bSApIHtcblxuICAgICAgICAgICAgdmFyIGluY3JlbWVudCA9IHRoaXMuX3NlZ21lbnRMZW5ndGggPSBudW1SYW5nZSAvICggc3BlY3RydW0ubGVuZ3RoIC0gMSApO1xuXG4gICAgICAgICAgICB0aGlzLl9ncmFkaWVudHMgPSBbXTtcblxuICAgICAgICAgICAgZm9yICggdmFyIGkgPSAwOyBpIDwgc3BlY3RydW0ubGVuZ3RoIC0gMTsgaSsrICkge1xuICAgICAgICAgICAgICAgIHZhciBjb2xvckdyYWRpZW50ID0gbmV3IENvbG9yR3JhZGllbnQoXG4gICAgICAgICAgICAgICAgICAgIHNwZWN0cnVtWyBpIF0sXG4gICAgICAgICAgICAgICAgICAgIHNwZWN0cnVtWyBpICsgMSBdLFxuICAgICAgICAgICAgICAgICAgICBpbmNyZW1lbnQgKiBpLFxuICAgICAgICAgICAgICAgICAgICBpbmNyZW1lbnQgKiAoIGkgKyAxIClcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHRoaXMuX2dyYWRpZW50c1sgaSBdID0gY29sb3JHcmFkaWVudDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fY29sb3JzID0gc3BlY3RydW07XG5cbiAgICAgICAgfSxcblxuICAgICAgICBjb2xvckF0OiBmdW5jdGlvbiggcmF0aW8sIGluUmdiICkge1xuXG4gICAgICAgICAgICB2YXIgbnVtYmVyID0gcmF0aW8gKiBudW1SYW5nZTtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IE1hdGgubWluKCBNYXRoLmZsb29yKCBudW1iZXIgLyB0aGlzLl9zZWdtZW50TGVuZ3RoICksIHRoaXMuX2dyYWRpZW50cy5sZW5ndGggLSAxICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZ3JhZGllbnRzWyBpbmRleCBdLmNvbG9yQXQoIG51bWJlciwgaW5SZ2IgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vQ09MT1IgR1JBRElFTlQgQ0xBU1NcbiAgICBmdW5jdGlvbiBDb2xvckdyYWRpZW50KCBjb2xvclN0YXJ0LCBjb2xvckVuZCwgbWluTnVtYmVyLCBtYXhOdW1iZXIgKSB7XG5cbiAgICAgICAgdGhpcy5fc3RhcnRDb2xvciA9IGdldEhleENvbG9yKCBjb2xvclN0YXJ0ICk7XG4gICAgICAgIHRoaXMuX2VuZENvbG9yID0gZ2V0SGV4Q29sb3IoIGNvbG9yRW5kICk7XG4gICAgICAgIHRoaXMuX21pbk51bWJlciA9IG1pbk51bWJlcjtcbiAgICAgICAgdGhpcy5fbWF4TnVtYmVyID0gbWF4TnVtYmVyO1xuICAgICAgICB0aGlzLl9yYW5nZSA9IHRoaXMuX21heE51bWJlciAtIHRoaXMuX21pbk51bWJlcjtcbiAgICB9XG5cbiAgICBDb2xvckdyYWRpZW50LnByb3RvdHlwZSA9IHtcblxuICAgICAgICBjb2xvckF0OiBmdW5jdGlvbiggbnVtYmVyLCBpblJnYiApIHtcblxuICAgICAgICAgICAgdmFyIHIgPSB0aGlzLmNhbGNJbnQoIG51bWJlciwgdGhpcy5fc3RhcnRDb2xvci5zdWJzdHJpbmcoIDAsIDIgKSwgdGhpcy5fZW5kQ29sb3Iuc3Vic3RyaW5nKCAwLCAyICkgKTtcbiAgICAgICAgICAgIHZhciBnID0gdGhpcy5jYWxjSW50KCBudW1iZXIsIHRoaXMuX3N0YXJ0Q29sb3Iuc3Vic3RyaW5nKCAyLCA0ICksIHRoaXMuX2VuZENvbG9yLnN1YnN0cmluZyggMiwgNCApICk7XG4gICAgICAgICAgICB2YXIgYiA9IHRoaXMuY2FsY0ludCggbnVtYmVyLCB0aGlzLl9zdGFydENvbG9yLnN1YnN0cmluZyggNCwgNiApLCB0aGlzLl9lbmRDb2xvci5zdWJzdHJpbmcoIDQsIDYgKSApO1xuXG4gICAgICAgICAgICBpZiAoIGluUmdiICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbIHIsIGcsIGIgXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGNIZXgoIHIgKSArIGNhbGNIZXgoIGcgKSArIGNhbGNIZXgoIGIgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9LFxuXG4gICAgICAgIGNhbGNJbnQ6IGZ1bmN0aW9uKCBudW1iZXIsIGNoYW5uZWxTdGFydF9CYXNlMTYsIGNoYW5uZWxFbmRfQmFzZTE2ICkge1xuXG4gICAgICAgICAgICB2YXIgbnVtID0gbnVtYmVyO1xuXG4gICAgICAgICAgICBpZiAoIG51bWJlciA8IHRoaXMuX21pbk51bWJlciApIHtcbiAgICAgICAgICAgICAgICBudW0gPSB0aGlzLl9taW5OdW1iZXI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBudW1iZXIgPiB0aGlzLl9tYXhOdW1iZXIgKSB7XG4gICAgICAgICAgICAgICAgbnVtID0gdGhpcy5fbWF4TnVtYmVyO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgY1N0YXJ0X0Jhc2UxMCA9IHBhcnNlSW50KCBjaGFubmVsU3RhcnRfQmFzZTE2LCAxNiApO1xuICAgICAgICAgICAgdmFyIGNFbmRfQmFzZTEwID0gcGFyc2VJbnQoIGNoYW5uZWxFbmRfQmFzZTE2LCAxNiApO1xuICAgICAgICAgICAgdmFyIGNQZXJVbml0ID0gKCBjRW5kX0Jhc2UxMCAtIGNTdGFydF9CYXNlMTAgKSAvIHRoaXMuX3JhbmdlO1xuICAgICAgICAgICAgdmFyIGNfQmFzZTEwID0gTWF0aC5yb3VuZCggY1BlclVuaXQgKiAoIG51bSAtIHRoaXMuX21pbk51bWJlciApICsgY1N0YXJ0X0Jhc2UxMCApO1xuXG4gICAgICAgICAgICByZXR1cm4gY19CYXNlMTA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvL1VUSUxTXG4gICAgZnVuY3Rpb24gY2FsY0hleCggaW50ZWdlciApIHtcbiAgICAgICAgcmV0dXJuIGZvcm1hdEhleCggaW50ZWdlci50b1N0cmluZyggMTYgKSApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdEhleCggaGV4ICkge1xuICAgICAgICByZXR1cm4gKCBoZXgubGVuZ3RoID09PSAxICkgPyAnMCcgKyBoZXggOiBoZXg7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0SGV4Q29sb3IoIHN0cmluZyApIHtcbiAgICAgICAgcmV0dXJuIHN0cmluZy5zdWJzdHJpbmcoIHN0cmluZy5sZW5ndGggLSA2LCBzdHJpbmcubGVuZ3RoICk7XG4gICAgfVxuXG4gICAgLy9FWFBPUlRJTkcgYXMgZ2xvYmFsIHZhciBpbiBicm93c2VyIG9mIGFzIGV4cG9ydCBpbiBub2RlXG4gICAgdmFyIHJvb3QgPSB0aGlzO1xuICAgIGlmICggdHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICBpZiAoIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzICkge1xuICAgICAgICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gUmFpbmJvdztcbiAgICAgICAgfVxuICAgICAgICBleHBvcnRzLlJhaW5ib3cgPSBSYWluYm93O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJvb3QuUmFpbmJvdyA9IFJhaW5ib3c7XG4gICAgfVxufSApKCk7IiwiKCBmdW5jdGlvbigpIHtcblxuXHQvL2RlcGVuZGVuY2llc1xuXHR2YXIgTm9pc2UgPSByZXF1aXJlKCBcImltcHJvdmVkbm9pc2VcIiApO1xuXHR2YXIgUmFpbmJvdyA9IHJlcXVpcmUoIFwicmFpbmJvd1wiICk7XG5cblx0dmFyIG1pblNpemUgPSA1O1xuXHR2YXIgbWF4U2l6ZSA9IDIwMDtcblxuXHR2YXIgbWluRnJlcXVlbmN5ID0gMSAvIDEwMDA7XG5cdHZhciBtYXhGcmVxdWVuY3kgPSAxIC8gMzA7XG5cblx0dmFyIG1pblNwZWVkID0gMC4wMDE7XG5cdHZhciBtYXhTcGVlZCA9IDAuMTtcblxuXHR2YXIgZnBzID0gMTAwMCAvIDYwO1xuXHR2YXIgZGVmYXVsdFRyYW5zaXRpb25UaW1lID0gNTtcblxuXHRmdW5jdGlvbiBDb2xvcmZ1bE5vaXNlKCBvcHRpb25zICkge1xuXG5cdFx0dGhpcy5fd2lkdGggPSBvcHRpb25zLndpZHRoIHx8IG1pblNpemUgKyAoIG9wdGlvbnMucXVhbGl0eSAqICggbWF4U2l6ZSAtIG1pblNpemUgKSApO1xuXHRcdHRoaXMuX2hlaWdodCA9IG9wdGlvbnMuaGVpZ2h0IHx8IHRoaXMuX3dpZHRoO1xuXG5cdFx0dGhpcy5fY29sb3JzID0gb3B0aW9ucy5jb2xvcnMgfHwgWyAnI0Y5NzBGOCcsICcjRjlGQkIxJywgJyNBQUZFQTMnLCAnIzk0RkVGNycsICcjRjlGQkIxJywgJyNGOTcwRjgnIF07XG5cblx0XHR0aGlzLl9mcmVxID0gbWluRnJlcXVlbmN5ICsgKCBvcHRpb25zLmdyYW51bGFyaXR5ICogKCBtYXhGcmVxdWVuY3kgLSBtaW5GcmVxdWVuY3kgKSApO1xuXG5cdFx0dGhpcy5fc3BlZWQgPSBtaW5TcGVlZCArICggb3B0aW9ucy5zcGVlZCAqICggbWF4U3BlZWQgLSBtaW5TcGVlZCApICk7XG5cblx0XHR0aGlzLl9hbmltYXRpbmcgPSBmYWxzZTtcblxuXHRcdHRoaXMuX2hhc0NhbnZhcyA9IG9wdGlvbnMuaGFzQ2FudmFzO1xuXG5cdFx0dGhpcy5fY29sb3JEYXRhID0gW107XG5cblx0XHR0aGlzLl96ID0gMDtcblx0XHR0aGlzLmluaXQoKTtcblx0fVxuXG5cdENvbG9yZnVsTm9pc2UucHJvdG90eXBlID0ge1xuXG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XG5cblx0XHRcdGlmICggdGhpcy5faGFzQ2FudmFzICkge1xuXHRcdFx0XHR0aGlzLl9jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImNhbnZhc1wiICk7XG5cdFx0XHRcdHRoaXMuX2N0eCA9IHRoaXMuX2NhbnZhcy5nZXRDb250ZXh0KCBcIjJkXCIgKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5fcmFpbmJvdyA9IG5ldyBSYWluYm93KCB0aGlzLl9jb2xvcnMgKTtcblx0XHRcdHRoaXMucmVzaXplKClcblx0XHR9LFxuXG5cdFx0dXBkYXRlTm9pc2U6IGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRpZiAoIHRoaXMuX3RvUmFpbmJvdyApIHtcblx0XHRcdFx0dGhpcy51cGRhdGVUb1JhaW5ib3coKTtcblx0XHRcdH1cblxuXHRcdFx0dmFyIHogPSAoIHRoaXMuX3ogKz0gdGhpcy5fc3BlZWQgKTtcblxuXHRcdFx0aWYgKCB0aGlzLl9oYXNDYW52YXMgKSB7XG5cdFx0XHRcdHZhciBwaXggPSB0aGlzLl9jdHguY3JlYXRlSW1hZ2VEYXRhKCB0aGlzLl9jYW52YXMud2lkdGgsIHRoaXMuX2NhbnZhcy5oZWlnaHQgKTtcblx0XHRcdFx0dmFyIGRhdGEgPSB0aGlzLl9jb2xvckRhdGEgPSBwaXguZGF0YTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZhciBkYXRhID0gdGhpcy5fY29sb3JEYXRhO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgaW5jID0gMCxcblx0XHRcdFx0eCA9IDAsXG5cdFx0XHRcdHkgPSAwLFxuXHRcdFx0XHRuLCByZ2I7XG5cblx0XHRcdGZvciAoIHkgPSAwOyB5IDwgdGhpcy5faGVpZ2h0OyB5KysgKSB7XG5cdFx0XHRcdGZvciAoIHggPSAwOyB4IDwgdGhpcy5fd2lkdGg7IHgrKyApIHtcblx0XHRcdFx0XHRuID0gTm9pc2UoIHggKiB0aGlzLl9mcmVxLCB5ICogdGhpcy5fZnJlcSwgeiApICsgLjU7XG5cblx0XHRcdFx0XHRpZiAoIG4gPCAwICkge1xuXHRcdFx0XHRcdFx0biA9IDA7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICggbiA+IDEgKSB7XG5cdFx0XHRcdFx0XHRuID0gMTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZ2IgPSB0aGlzLl9yYWluYm93LmNvbG9yQXQoIG4sIHRydWUgKTtcblxuXHRcdFx0XHRcdGlmICggdGhpcy5fdG9SYWluYm93ICkge1xuXHRcdFx0XHRcdFx0cmdiMiA9IHRoaXMuX3RvUmFpbmJvdy5jb2xvckF0KCBuLCB0cnVlICk7XG5cdFx0XHRcdFx0XHRyZ2IgPSB0aGlzLmJsZW5kQ29sb3JzKCByZ2IsIHJnYjIsIHRoaXMuX3RvUmFpbmJvd1JhdGlvICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0ZGF0YVsgaW5jKysgXSA9IHJnYlsgMCBdO1xuXHRcdFx0XHRcdGRhdGFbIGluYysrIF0gPSByZ2JbIDEgXTtcblx0XHRcdFx0XHRkYXRhWyBpbmMrKyBdID0gcmdiWyAyIF07XG5cdFx0XHRcdFx0ZGF0YVsgaW5jKysgXSA9IDI1NTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIHRoaXMuX2hhc0NhbnZhcyApIHtcblx0XHRcdFx0dGhpcy5fY3R4LnB1dEltYWdlRGF0YSggcGl4LCAwLCAwICk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdGJsZW5kQ29sb3JzOiBmdW5jdGlvbiggb2xkQ29sb3IsIG5ld0NvbG9yLCByYXRpbyApIHtcblxuXHRcdFx0dmFyIHIgPSBvbGRDb2xvclsgMCBdICsgKCBuZXdDb2xvclsgMCBdIC0gb2xkQ29sb3JbIDAgXSApICogcmF0aW87XG5cdFx0XHR2YXIgZyA9IG9sZENvbG9yWyAxIF0gKyAoIG5ld0NvbG9yWyAxIF0gLSBvbGRDb2xvclsgMSBdICkgKiByYXRpbztcblx0XHRcdHZhciBiID0gb2xkQ29sb3JbIDIgXSArICggbmV3Q29sb3JbIDIgXSAtIG9sZENvbG9yWyAyIF0gKSAqIHJhdGlvO1xuXHRcdFx0cmV0dXJuIFsgciwgZywgYiBdO1xuXHRcdH0sXG5cblx0XHR1cGRhdGVSYWluYm93OiBmdW5jdGlvbiggY29sb3JBcnJheSwgdHJhbnNpdGlvblRpbWUgKSB7XG5cblx0XHRcdHRoaXMuX3RyYW5zaXRpb25UaW1lID0gaXNOYU4oIHRyYW5zaXRpb25UaW1lICkgPyBkZWZhdWx0VHJhbnNpdGlvblRpbWUgOiB0cmFuc2l0aW9uVGltZTtcblx0XHRcdHRoaXMuX3RpY2tlciA9IDA7XG5cdFx0XHR0aGlzLl90b1JhaW5ib3cgPSBuZXcgUmFpbmJvdyggY29sb3JBcnJheSApO1xuXHRcdH0sXG5cblx0XHR1cGRhdGVUb1JhaW5ib3c6IGZ1bmN0aW9uKCkge1xuXG5cdFx0XHR0aGlzLl90aWNrZXIrKztcblx0XHRcdHRoaXMuX3RvUmFpbmJvd1JhdGlvID0gKCB0aGlzLl90aWNrZXIgLyAoIHRoaXMuX3RyYW5zaXRpb25UaW1lICogZnBzICkgKTtcblxuXHRcdFx0aWYgKCB0aGlzLl90b1JhaW5ib3dSYXRpbyA+PSAxICkge1xuXHRcdFx0XHR0aGlzLl9yYWluYm93ID0gdGhpcy5fdG9SYWluYm93O1xuXHRcdFx0XHR0aGlzLl90b1JhaW5ib3cgPSBudWxsO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRzdGFydDogZnVuY3Rpb24oKSB7XG5cblx0XHRcdHRoaXMuX2FuaW1hdGluZyA9IHRydWU7XG5cdFx0XHR0aGlzLmFuaW1hdGUoKTtcblx0XHR9LFxuXG5cdFx0c3RvcDogZnVuY3Rpb24oKSB7XG5cblx0XHRcdHRoaXMuX2FuaW1hdGluZyA9IGZhbHNlO1xuXHRcdH0sXG5cblx0XHRhbmltYXRlOiBmdW5jdGlvbigpIHtcblxuXHRcdFx0aWYgKCB0aGlzLl9hbmltYXRpbmcgKSB7XG5cdFx0XHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZSggdGhpcy5hbmltYXRlLmJpbmQoIHRoaXMgKSApO1xuXHRcdFx0XHR0aGlzLnVwZGF0ZU5vaXNlKCk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdHVwZGF0ZTogZnVuY3Rpb24oKSB7XG5cblx0XHRcdHRoaXMudXBkYXRlTm9pc2UoKTtcblx0XHR9LFxuXG5cdFx0cmVzaXplOiBmdW5jdGlvbigpIHtcblxuXHRcdFx0aWYgKCB0aGlzLl9oYXNDYW52YXMgKSB7XG5cdFx0XHRcdHRoaXMuX2NhbnZhcy53aWR0aCA9IHRoaXMuX3dpZHRoO1xuXHRcdFx0XHR0aGlzLl9jYW52YXMuaGVpZ2h0ID0gdGhpcy5faGVpZ2h0O1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRnZXRDYW52YXM6IGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5fY2FudmFzO1xuXHRcdH0sXG5cblx0XHRnZXREYXRhOiBmdW5jdGlvbigpIHtcblxuXHRcdFx0cmV0dXJuIHRoaXMuX2NvbG9yRGF0YTtcblx0XHR9LFxuXG5cdFx0Z2V0Q29sb3JBdDogZnVuY3Rpb24oIHgsIHkgKSB7XG5cblx0XHRcdHZhciBpbmRleCA9ICggeSAqIHRoaXMuX3dpZHRoICsgeCApICogMztcblxuXHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0dGhpcy5fY29sb3JEYXRhWyBpbmRleCBdLFxuXHRcdFx0XHR0aGlzLl9jb2xvckRhdGFbIGluZGV4ICsgMSBdLFxuXHRcdFx0XHR0aGlzLl9jb2xvckRhdGFbIGluZGV4ICsgMiBdXG5cdFx0XHRdO1xuXHRcdH1cblx0fVxuXG5cdC8vZXhwb3J0aW5nIG90aGVyIGxpYnJhcmllc1xuXHRDb2xvcmZ1bE5vaXNlLk5vaXNlID0gTm9pc2U7XG5cdENvbG9yZnVsTm9pc2UuUmFpbmJvdyA9IFJhaW5ib3c7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBDb2xvcmZ1bE5vaXNlO1xufSApKCk7Il19
