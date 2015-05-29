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