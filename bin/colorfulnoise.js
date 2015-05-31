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
	var transitionTime = 5;

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

		updateRainbow: function( colorArray ) {

			this._ticker = 0;
			this._toRainbow = new Rainbow( colorArray );
		},

		updateToRainbow: function() {

			this._ticker++;
			this._toRainbowRatio = ( this._ticker / ( transitionTime * fps ) );

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9ub2RlX21vZHVsZXMvaW1wcm92ZWRub2lzZS9pbXByb3ZlZG5vaXNlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3JhaW5ib3cvcmFpbmJvdy5qcyIsIi4uL3NyYy9jb2xvcmZ1bG5vaXNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gSU1QTEVNRU5UQVRJT04gT0YgSU1QUk9WRUQgTk9JU0UgLSBDT1BZUklHSFQgMjAwMiBLRU4gUEVSTElOLlxuKCBmdW5jdGlvbigpIHtcbiAgdmFyIHAgPSBbXTtcbiAgdmFyIHBlcm11dGF0aW9uID0gWyAxNTEsIDE2MCwgMTM3LCA5MSwgOTAsIDE1LFxuICAgIDEzMSwgMTMsIDIwMSwgOTUsIDk2LCA1MywgMTk0LCAyMzMsIDcsIDIyNSwgMTQwLCAzNiwgMTAzLCAzMCwgNjksIDE0MiwgOCwgOTksIDM3LCAyNDAsIDIxLCAxMCwgMjMsXG4gICAgMTkwLCA2LCAxNDgsIDI0NywgMTIwLCAyMzQsIDc1LCAwLCAyNiwgMTk3LCA2MiwgOTQsIDI1MiwgMjE5LCAyMDMsIDExNywgMzUsIDExLCAzMiwgNTcsIDE3NywgMzMsXG4gICAgODgsIDIzNywgMTQ5LCA1NiwgODcsIDE3NCwgMjAsIDEyNSwgMTM2LCAxNzEsIDE2OCwgNjgsIDE3NSwgNzQsIDE2NSwgNzEsIDEzNCwgMTM5LCA0OCwgMjcsIDE2NixcbiAgICA3NywgMTQ2LCAxNTgsIDIzMSwgODMsIDExMSwgMjI5LCAxMjIsIDYwLCAyMTEsIDEzMywgMjMwLCAyMjAsIDEwNSwgOTIsIDQxLCA1NSwgNDYsIDI0NSwgNDAsIDI0NCxcbiAgICAxMDIsIDE0MywgNTQsIDY1LCAyNSwgNjMsIDE2MSwgMSwgMjE2LCA4MCwgNzMsIDIwOSwgNzYsIDEzMiwgMTg3LCAyMDgsIDg5LCAxOCwgMTY5LCAyMDAsIDE5NixcbiAgICAxMzUsIDEzMCwgMTE2LCAxODgsIDE1OSwgODYsIDE2NCwgMTAwLCAxMDksIDE5OCwgMTczLCAxODYsIDMsIDY0LCA1MiwgMjE3LCAyMjYsIDI1MCwgMTI0LCAxMjMsXG4gICAgNSwgMjAyLCAzOCwgMTQ3LCAxMTgsIDEyNiwgMjU1LCA4MiwgODUsIDIxMiwgMjA3LCAyMDYsIDU5LCAyMjcsIDQ3LCAxNiwgNTgsIDE3LCAxODIsIDE4OSwgMjgsIDQyLFxuICAgIDIyMywgMTgzLCAxNzAsIDIxMywgMTE5LCAyNDgsIDE1MiwgMiwgNDQsIDE1NCwgMTYzLCA3MCwgMjIxLCAxNTMsIDEwMSwgMTU1LCAxNjcsIDQzLCAxNzIsIDksXG4gICAgMTI5LCAyMiwgMzksIDI1MywgMTksIDk4LCAxMDgsIDExMCwgNzksIDExMywgMjI0LCAyMzIsIDE3OCwgMTg1LCAxMTIsIDEwNCwgMjE4LCAyNDYsIDk3LCAyMjgsXG4gICAgMjUxLCAzNCwgMjQyLCAxOTMsIDIzOCwgMjEwLCAxNDQsIDEyLCAxOTEsIDE3OSwgMTYyLCAyNDEsIDgxLCA1MSwgMTQ1LCAyMzUsIDI0OSwgMTQsIDIzOSwgMTA3LFxuICAgIDQ5LCAxOTIsIDIxNCwgMzEsIDE4MSwgMTk5LCAxMDYsIDE1NywgMTg0LCA4NCwgMjA0LCAxNzYsIDExNSwgMTIxLCA1MCwgNDUsIDEyNywgNCwgMTUwLCAyNTQsXG4gICAgMTM4LCAyMzYsIDIwNSwgOTMsIDIyMiwgMTE0LCA2NywgMjksIDI0LCA3MiwgMjQzLCAxNDEsIDEyOCwgMTk1LCA3OCwgNjYsIDIxNSwgNjEsIDE1NiwgMTgwXG4gIF07XG5cbiAgZm9yICggdmFyIGkgPSAwOyBpIDwgMjU2OyBpKysgKVxuICAgIHBbIDI1NiArIGkgXSA9IHBbIGkgXSA9IHBlcm11dGF0aW9uWyBpIF07XG5cbiAgZnVuY3Rpb24gTm9pc2UoIHgsIHksIHogKSB7XG4gICAgdmFyIFggPSBNYXRoLmZsb29yKCB4ICkgJiAyNTUsXG4gICAgICBZID0gTWF0aC5mbG9vciggeSApICYgMjU1LFxuICAgICAgWiA9IE1hdGguZmxvb3IoIHogKSAmIDI1NTtcbiAgICB4IC09IE1hdGguZmxvb3IoIHggKTtcbiAgICB5IC09IE1hdGguZmxvb3IoIHkgKTtcbiAgICB6IC09IE1hdGguZmxvb3IoIHogKTtcblxuICAgIHZhciB1ID0gZmFkZSggeCApLFxuICAgICAgdiA9IGZhZGUoIHkgKSxcbiAgICAgIHcgPSBmYWRlKCB6ICk7XG4gICAgdmFyIEEgPSBwWyBYIF0gKyBZLFxuICAgICAgQUEgPSBwWyBBIF0gKyBaLFxuICAgICAgQUIgPSBwWyBBICsgMSBdICsgWixcbiAgICAgIEIgPSBwWyBYICsgMSBdICsgWSxcbiAgICAgIEJBID0gcFsgQiBdICsgWixcbiAgICAgIEJCID0gcFsgQiArIDEgXSArIFo7XG5cbiAgICByZXR1cm4gbGVycCggdywgbGVycCggdiwgbGVycCggdSwgZ3JhZCggcFsgQUEgXSwgeCwgeSwgeiApLFxuICAgICAgICAgIGdyYWQoIHBbIEJBIF0sIHggLSAxLCB5LCB6ICkgKSxcbiAgICAgICAgbGVycCggdSwgZ3JhZCggcFsgQUIgXSwgeCwgeSAtIDEsIHogKSxcbiAgICAgICAgICBncmFkKCBwWyBCQiBdLCB4IC0gMSwgeSAtIDEsIHogKSApICksXG4gICAgICBsZXJwKCB2LCBsZXJwKCB1LCBncmFkKCBwWyBBQSArIDEgXSwgeCwgeSwgeiAtIDEgKSxcbiAgICAgICAgICBncmFkKCBwWyBCQSArIDEgXSwgeCAtIDEsIHksIHogLSAxICkgKSxcbiAgICAgICAgbGVycCggdSwgZ3JhZCggcFsgQUIgKyAxIF0sIHgsIHkgLSAxLCB6IC0gMSApLFxuICAgICAgICAgIGdyYWQoIHBbIEJCICsgMSBdLCB4IC0gMSwgeSAtIDEsIHogLSAxICkgKSApICk7XG4gIH1cblxuICBmdW5jdGlvbiBmYWRlKCB0ICkge1xuICAgIHJldHVybiB0ICogdCAqIHQgKiAoIHQgKiAoIHQgKiA2IC0gMTUgKSArIDEwICk7XG4gIH1cblxuICBmdW5jdGlvbiBsZXJwKCB0LCBhLCBiICkge1xuICAgIHJldHVybiBhICsgdCAqICggYiAtIGEgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdyYWQoIGhhc2gsIHgsIHksIHogKSB7XG4gICAgdmFyIGggPSBoYXNoICYgMTU7XG4gICAgdmFyIHUgPSBoIDwgOCA/IHggOiB5LFxuICAgICAgdiA9IGggPCA0ID8geSA6IGggPT0gMTIgfHwgaCA9PSAxNCA/IHggOiB6O1xuICAgIHJldHVybiAoICggaCAmIDEgKSA9PSAwID8gdSA6IC11ICkgKyAoICggaCAmIDIgKSA9PSAwID8gdiA6IC12ICk7XG4gIH1cblxuICAvL0VYUE9SVElORyBhcyBnbG9iYWwgdmFyIGluIGJyb3dzZXIgb3IgYXMgZXhwb3J0IGluIG5vZGVcbiAgaWYgKCB0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgaWYgKCB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cyApIHtcbiAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IE5vaXNlO1xuICAgIH1cbiAgICBleHBvcnRzLk5vaXNlID0gTm9pc2U7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5Ob2lzZSA9IE5vaXNlO1xuICB9XG59ICkoKTsiLCIoIGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIG51bVJhbmdlID0gMTAwO1xuXG4gICAgLy9SQUlOQk9XIENMQVNTXG4gICAgZnVuY3Rpb24gUmFpbmJvdyggc3BlY3RydW0gKSB7XG5cbiAgICAgICAgdGhpcy5fZ3JhZGllbnRzID0gbnVsbDtcbiAgICAgICAgdGhpcy5fY29sb3JzID0gbnVsbDtcbiAgICAgICAgdGhpcy5zZXRDb2xvcnMoIHNwZWN0cnVtICk7XG4gICAgfVxuXG4gICAgUmFpbmJvdy5wcm90b3R5cGUgPSB7XG5cbiAgICAgICAgc2V0Q29sb3JzOiBmdW5jdGlvbiggc3BlY3RydW0gKSB7XG5cbiAgICAgICAgICAgIHZhciBpbmNyZW1lbnQgPSB0aGlzLl9zZWdtZW50TGVuZ3RoID0gbnVtUmFuZ2UgLyAoIHNwZWN0cnVtLmxlbmd0aCAtIDEgKTtcblxuICAgICAgICAgICAgdGhpcy5fZ3JhZGllbnRzID0gW107XG5cbiAgICAgICAgICAgIGZvciAoIHZhciBpID0gMDsgaSA8IHNwZWN0cnVtLmxlbmd0aCAtIDE7IGkrKyApIHtcbiAgICAgICAgICAgICAgICB2YXIgY29sb3JHcmFkaWVudCA9IG5ldyBDb2xvckdyYWRpZW50KFxuICAgICAgICAgICAgICAgICAgICBzcGVjdHJ1bVsgaSBdLFxuICAgICAgICAgICAgICAgICAgICBzcGVjdHJ1bVsgaSArIDEgXSxcbiAgICAgICAgICAgICAgICAgICAgaW5jcmVtZW50ICogaSxcbiAgICAgICAgICAgICAgICAgICAgaW5jcmVtZW50ICogKCBpICsgMSApXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9ncmFkaWVudHNbIGkgXSA9IGNvbG9yR3JhZGllbnQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2NvbG9ycyA9IHNwZWN0cnVtO1xuXG4gICAgICAgIH0sXG5cbiAgICAgICAgY29sb3JBdDogZnVuY3Rpb24oIHJhdGlvLCBpblJnYiApIHtcblxuICAgICAgICAgICAgdmFyIG51bWJlciA9IHJhdGlvICogbnVtUmFuZ2U7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSBNYXRoLm1pbiggTWF0aC5mbG9vciggbnVtYmVyIC8gdGhpcy5fc2VnbWVudExlbmd0aCApLCB0aGlzLl9ncmFkaWVudHMubGVuZ3RoIC0gMSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2dyYWRpZW50c1sgaW5kZXggXS5jb2xvckF0KCBudW1iZXIsIGluUmdiICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvL0NPTE9SIEdSQURJRU5UIENMQVNTXG4gICAgZnVuY3Rpb24gQ29sb3JHcmFkaWVudCggY29sb3JTdGFydCwgY29sb3JFbmQsIG1pbk51bWJlciwgbWF4TnVtYmVyICkge1xuXG4gICAgICAgIHRoaXMuX3N0YXJ0Q29sb3IgPSBnZXRIZXhDb2xvciggY29sb3JTdGFydCApO1xuICAgICAgICB0aGlzLl9lbmRDb2xvciA9IGdldEhleENvbG9yKCBjb2xvckVuZCApO1xuICAgICAgICB0aGlzLl9taW5OdW1iZXIgPSBtaW5OdW1iZXI7XG4gICAgICAgIHRoaXMuX21heE51bWJlciA9IG1heE51bWJlcjtcbiAgICAgICAgdGhpcy5fcmFuZ2UgPSB0aGlzLl9tYXhOdW1iZXIgLSB0aGlzLl9taW5OdW1iZXI7XG4gICAgfVxuXG4gICAgQ29sb3JHcmFkaWVudC5wcm90b3R5cGUgPSB7XG5cbiAgICAgICAgY29sb3JBdDogZnVuY3Rpb24oIG51bWJlciwgaW5SZ2IgKSB7XG5cbiAgICAgICAgICAgIHZhciByID0gdGhpcy5jYWxjSW50KCBudW1iZXIsIHRoaXMuX3N0YXJ0Q29sb3Iuc3Vic3RyaW5nKCAwLCAyICksIHRoaXMuX2VuZENvbG9yLnN1YnN0cmluZyggMCwgMiApICk7XG4gICAgICAgICAgICB2YXIgZyA9IHRoaXMuY2FsY0ludCggbnVtYmVyLCB0aGlzLl9zdGFydENvbG9yLnN1YnN0cmluZyggMiwgNCApLCB0aGlzLl9lbmRDb2xvci5zdWJzdHJpbmcoIDIsIDQgKSApO1xuICAgICAgICAgICAgdmFyIGIgPSB0aGlzLmNhbGNJbnQoIG51bWJlciwgdGhpcy5fc3RhcnRDb2xvci5zdWJzdHJpbmcoIDQsIDYgKSwgdGhpcy5fZW5kQ29sb3Iuc3Vic3RyaW5nKCA0LCA2ICkgKTtcblxuICAgICAgICAgICAgaWYgKCBpblJnYiApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gWyByLCBnLCBiIF07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxjSGV4KCByICkgKyBjYWxjSGV4KCBnICkgKyBjYWxjSGV4KCBiICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSxcblxuICAgICAgICBjYWxjSW50OiBmdW5jdGlvbiggbnVtYmVyLCBjaGFubmVsU3RhcnRfQmFzZTE2LCBjaGFubmVsRW5kX0Jhc2UxNiApIHtcblxuICAgICAgICAgICAgdmFyIG51bSA9IG51bWJlcjtcblxuICAgICAgICAgICAgaWYgKCBudW1iZXIgPCB0aGlzLl9taW5OdW1iZXIgKSB7XG4gICAgICAgICAgICAgICAgbnVtID0gdGhpcy5fbWluTnVtYmVyO1xuICAgICAgICAgICAgfSBlbHNlIGlmICggbnVtYmVyID4gdGhpcy5fbWF4TnVtYmVyICkge1xuICAgICAgICAgICAgICAgIG51bSA9IHRoaXMuX21heE51bWJlcjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGNTdGFydF9CYXNlMTAgPSBwYXJzZUludCggY2hhbm5lbFN0YXJ0X0Jhc2UxNiwgMTYgKTtcbiAgICAgICAgICAgIHZhciBjRW5kX0Jhc2UxMCA9IHBhcnNlSW50KCBjaGFubmVsRW5kX0Jhc2UxNiwgMTYgKTtcbiAgICAgICAgICAgIHZhciBjUGVyVW5pdCA9ICggY0VuZF9CYXNlMTAgLSBjU3RhcnRfQmFzZTEwICkgLyB0aGlzLl9yYW5nZTtcbiAgICAgICAgICAgIHZhciBjX0Jhc2UxMCA9IE1hdGgucm91bmQoIGNQZXJVbml0ICogKCBudW0gLSB0aGlzLl9taW5OdW1iZXIgKSArIGNTdGFydF9CYXNlMTAgKTtcblxuICAgICAgICAgICAgcmV0dXJuIGNfQmFzZTEwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy9VVElMU1xuICAgIGZ1bmN0aW9uIGNhbGNIZXgoIGludGVnZXIgKSB7XG4gICAgICAgIHJldHVybiBmb3JtYXRIZXgoIGludGVnZXIudG9TdHJpbmcoIDE2ICkgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXRIZXgoIGhleCApIHtcbiAgICAgICAgcmV0dXJuICggaGV4Lmxlbmd0aCA9PT0gMSApID8gJzAnICsgaGV4IDogaGV4O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEhleENvbG9yKCBzdHJpbmcgKSB7XG4gICAgICAgIHJldHVybiBzdHJpbmcuc3Vic3RyaW5nKCBzdHJpbmcubGVuZ3RoIC0gNiwgc3RyaW5nLmxlbmd0aCApO1xuICAgIH1cblxuICAgIC8vRVhQT1JUSU5HIGFzIGdsb2JhbCB2YXIgaW4gYnJvd3NlciBvZiBhcyBleHBvcnQgaW4gbm9kZVxuICAgIHZhciByb290ID0gdGhpcztcbiAgICBpZiAoIHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgaWYgKCB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cyApIHtcbiAgICAgICAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IFJhaW5ib3c7XG4gICAgICAgIH1cbiAgICAgICAgZXhwb3J0cy5SYWluYm93ID0gUmFpbmJvdztcbiAgICB9IGVsc2Uge1xuICAgICAgICByb290LlJhaW5ib3cgPSBSYWluYm93O1xuICAgIH1cbn0gKSgpOyIsIiggZnVuY3Rpb24oKSB7XG5cblx0Ly9kZXBlbmRlbmNpZXNcblx0dmFyIE5vaXNlID0gcmVxdWlyZSggXCJpbXByb3ZlZG5vaXNlXCIgKTtcblx0dmFyIFJhaW5ib3cgPSByZXF1aXJlKCBcInJhaW5ib3dcIiApO1xuXG5cdHZhciBtaW5TaXplID0gNTtcblx0dmFyIG1heFNpemUgPSAyMDA7XG5cblx0dmFyIG1pbkZyZXF1ZW5jeSA9IDEgLyAxMDAwO1xuXHR2YXIgbWF4RnJlcXVlbmN5ID0gMSAvIDMwO1xuXG5cdHZhciBtaW5TcGVlZCA9IDAuMDAxO1xuXHR2YXIgbWF4U3BlZWQgPSAwLjE7XG5cblx0dmFyIGZwcyA9IDEwMDAgLyA2MDtcblx0dmFyIHRyYW5zaXRpb25UaW1lID0gNTtcblxuXHRmdW5jdGlvbiBDb2xvcmZ1bE5vaXNlKCBvcHRpb25zICkge1xuXG5cdFx0dGhpcy5fd2lkdGggPSBvcHRpb25zLndpZHRoIHx8IG1pblNpemUgKyAoIG9wdGlvbnMucXVhbGl0eSAqICggbWF4U2l6ZSAtIG1pblNpemUgKSApO1xuXHRcdHRoaXMuX2hlaWdodCA9IG9wdGlvbnMuaGVpZ2h0IHx8IHRoaXMuX3dpZHRoO1xuXG5cdFx0dGhpcy5fY29sb3JzID0gb3B0aW9ucy5jb2xvcnMgfHwgWyAnI0Y5NzBGOCcsICcjRjlGQkIxJywgJyNBQUZFQTMnLCAnIzk0RkVGNycsICcjRjlGQkIxJywgJyNGOTcwRjgnIF07XG5cblx0XHR0aGlzLl9mcmVxID0gbWluRnJlcXVlbmN5ICsgKCBvcHRpb25zLmdyYW51bGFyaXR5ICogKCBtYXhGcmVxdWVuY3kgLSBtaW5GcmVxdWVuY3kgKSApO1xuXG5cdFx0dGhpcy5fc3BlZWQgPSBtaW5TcGVlZCArICggb3B0aW9ucy5zcGVlZCAqICggbWF4U3BlZWQgLSBtaW5TcGVlZCApICk7XG5cblx0XHR0aGlzLl9hbmltYXRpbmcgPSBmYWxzZTtcblxuXHRcdHRoaXMuX2hhc0NhbnZhcyA9IG9wdGlvbnMuaGFzQ2FudmFzO1xuXG5cdFx0dGhpcy5fY29sb3JEYXRhID0gW107XG5cblx0XHR0aGlzLl96ID0gMDtcblx0XHR0aGlzLmluaXQoKTtcblx0fVxuXG5cdENvbG9yZnVsTm9pc2UucHJvdG90eXBlID0ge1xuXG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XG5cblx0XHRcdGlmICggdGhpcy5faGFzQ2FudmFzICkge1xuXHRcdFx0XHR0aGlzLl9jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImNhbnZhc1wiICk7XG5cdFx0XHRcdHRoaXMuX2N0eCA9IHRoaXMuX2NhbnZhcy5nZXRDb250ZXh0KCBcIjJkXCIgKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5fcmFpbmJvdyA9IG5ldyBSYWluYm93KCB0aGlzLl9jb2xvcnMgKTtcblx0XHRcdHRoaXMucmVzaXplKClcblx0XHR9LFxuXG5cdFx0dXBkYXRlTm9pc2U6IGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRpZiAoIHRoaXMuX3RvUmFpbmJvdyApIHtcblx0XHRcdFx0dGhpcy51cGRhdGVUb1JhaW5ib3coKTtcblx0XHRcdH1cblxuXHRcdFx0dmFyIHogPSAoIHRoaXMuX3ogKz0gdGhpcy5fc3BlZWQgKTtcblxuXHRcdFx0aWYgKCB0aGlzLl9oYXNDYW52YXMgKSB7XG5cdFx0XHRcdHZhciBwaXggPSB0aGlzLl9jdHguY3JlYXRlSW1hZ2VEYXRhKCB0aGlzLl9jYW52YXMud2lkdGgsIHRoaXMuX2NhbnZhcy5oZWlnaHQgKTtcblx0XHRcdFx0dmFyIGRhdGEgPSB0aGlzLl9jb2xvckRhdGEgPSBwaXguZGF0YTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZhciBkYXRhID0gdGhpcy5fY29sb3JEYXRhO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgaW5jID0gMCxcblx0XHRcdFx0eCA9IDAsXG5cdFx0XHRcdHkgPSAwLFxuXHRcdFx0XHRuLCByZ2I7XG5cblx0XHRcdGZvciAoIHkgPSAwOyB5IDwgdGhpcy5faGVpZ2h0OyB5KysgKSB7XG5cdFx0XHRcdGZvciAoIHggPSAwOyB4IDwgdGhpcy5fd2lkdGg7IHgrKyApIHtcblx0XHRcdFx0XHRuID0gTm9pc2UoIHggKiB0aGlzLl9mcmVxLCB5ICogdGhpcy5fZnJlcSwgeiApICsgLjU7XG5cblx0XHRcdFx0XHRpZiAoIG4gPCAwICkge1xuXHRcdFx0XHRcdFx0biA9IDA7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICggbiA+IDEgKSB7XG5cdFx0XHRcdFx0XHRuID0gMTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZ2IgPSB0aGlzLl9yYWluYm93LmNvbG9yQXQoIG4sIHRydWUgKTtcblxuXHRcdFx0XHRcdGlmICggdGhpcy5fdG9SYWluYm93ICkge1xuXHRcdFx0XHRcdFx0cmdiMiA9IHRoaXMuX3RvUmFpbmJvdy5jb2xvckF0KCBuLCB0cnVlICk7XG5cdFx0XHRcdFx0XHRyZ2IgPSB0aGlzLmJsZW5kQ29sb3JzKCByZ2IsIHJnYjIsIHRoaXMuX3RvUmFpbmJvd1JhdGlvICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0ZGF0YVsgaW5jKysgXSA9IHJnYlsgMCBdO1xuXHRcdFx0XHRcdGRhdGFbIGluYysrIF0gPSByZ2JbIDEgXTtcblx0XHRcdFx0XHRkYXRhWyBpbmMrKyBdID0gcmdiWyAyIF07XG5cdFx0XHRcdFx0ZGF0YVsgaW5jKysgXSA9IDI1NTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIHRoaXMuX2hhc0NhbnZhcyApIHtcblx0XHRcdFx0dGhpcy5fY3R4LnB1dEltYWdlRGF0YSggcGl4LCAwLCAwICk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdGJsZW5kQ29sb3JzOiBmdW5jdGlvbiggb2xkQ29sb3IsIG5ld0NvbG9yLCByYXRpbyApIHtcblxuXHRcdFx0dmFyIHIgPSBvbGRDb2xvclsgMCBdICsgKCBuZXdDb2xvclsgMCBdIC0gb2xkQ29sb3JbIDAgXSApICogcmF0aW87XG5cdFx0XHR2YXIgZyA9IG9sZENvbG9yWyAxIF0gKyAoIG5ld0NvbG9yWyAxIF0gLSBvbGRDb2xvclsgMSBdICkgKiByYXRpbztcblx0XHRcdHZhciBiID0gb2xkQ29sb3JbIDIgXSArICggbmV3Q29sb3JbIDIgXSAtIG9sZENvbG9yWyAyIF0gKSAqIHJhdGlvO1xuXHRcdFx0cmV0dXJuIFsgciwgZywgYiBdO1xuXHRcdH0sXG5cblx0XHR1cGRhdGVSYWluYm93OiBmdW5jdGlvbiggY29sb3JBcnJheSApIHtcblxuXHRcdFx0dGhpcy5fdGlja2VyID0gMDtcblx0XHRcdHRoaXMuX3RvUmFpbmJvdyA9IG5ldyBSYWluYm93KCBjb2xvckFycmF5ICk7XG5cdFx0fSxcblxuXHRcdHVwZGF0ZVRvUmFpbmJvdzogZnVuY3Rpb24oKSB7XG5cblx0XHRcdHRoaXMuX3RpY2tlcisrO1xuXHRcdFx0dGhpcy5fdG9SYWluYm93UmF0aW8gPSAoIHRoaXMuX3RpY2tlciAvICggdHJhbnNpdGlvblRpbWUgKiBmcHMgKSApO1xuXG5cdFx0XHRpZiAoIHRoaXMuX3RvUmFpbmJvd1JhdGlvID49IDEgKSB7XG5cdFx0XHRcdHRoaXMuX3JhaW5ib3cgPSB0aGlzLl90b1JhaW5ib3c7XG5cdFx0XHRcdHRoaXMuX3RvUmFpbmJvdyA9IG51bGw7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdHN0YXJ0OiBmdW5jdGlvbigpIHtcblxuXHRcdFx0dGhpcy5fYW5pbWF0aW5nID0gdHJ1ZTtcblx0XHRcdHRoaXMuYW5pbWF0ZSgpO1xuXHRcdH0sXG5cblx0XHRzdG9wOiBmdW5jdGlvbigpIHtcblxuXHRcdFx0dGhpcy5fYW5pbWF0aW5nID0gZmFsc2U7XG5cdFx0fSxcblxuXHRcdGFuaW1hdGU6IGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRpZiAoIHRoaXMuX2FuaW1hdGluZyApIHtcblx0XHRcdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKCB0aGlzLmFuaW1hdGUuYmluZCggdGhpcyApICk7XG5cdFx0XHRcdHRoaXMudXBkYXRlTm9pc2UoKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0dXBkYXRlOiBmdW5jdGlvbigpIHtcblxuXHRcdFx0dGhpcy51cGRhdGVOb2lzZSgpO1xuXHRcdH0sXG5cblx0XHRyZXNpemU6IGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRpZiAoIHRoaXMuX2hhc0NhbnZhcyApIHtcblx0XHRcdFx0dGhpcy5fY2FudmFzLndpZHRoID0gdGhpcy5fd2lkdGg7XG5cdFx0XHRcdHRoaXMuX2NhbnZhcy5oZWlnaHQgPSB0aGlzLl9oZWlnaHQ7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdGdldENhbnZhczogZnVuY3Rpb24oKSB7XG5cblx0XHRcdHJldHVybiB0aGlzLl9jYW52YXM7XG5cdFx0fSxcblxuXHRcdGdldERhdGE6IGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5fY29sb3JEYXRhO1xuXHRcdH0sXG5cblx0XHRnZXRDb2xvckF0OiBmdW5jdGlvbiggeCwgeSApIHtcblxuXHRcdFx0dmFyIGluZGV4ID0gKCB5ICogdGhpcy5fd2lkdGggKyB4ICkgKiAzO1xuXG5cdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHR0aGlzLl9jb2xvckRhdGFbIGluZGV4IF0sXG5cdFx0XHRcdHRoaXMuX2NvbG9yRGF0YVsgaW5kZXggKyAxIF0sXG5cdFx0XHRcdHRoaXMuX2NvbG9yRGF0YVsgaW5kZXggKyAyIF1cblx0XHRcdF07XG5cdFx0fVxuXHR9XG5cblx0Ly9leHBvcnRpbmcgb3RoZXIgbGlicmFyaWVzXG5cdENvbG9yZnVsTm9pc2UuTm9pc2UgPSBOb2lzZTtcblx0Q29sb3JmdWxOb2lzZS5SYWluYm93ID0gUmFpbmJvdztcblxuXHRtb2R1bGUuZXhwb3J0cyA9IENvbG9yZnVsTm9pc2U7XG59ICkoKTsiXX0=
