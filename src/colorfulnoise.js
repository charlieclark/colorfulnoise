( function() {

	//dependencies
	var Noise = require( "improvednoise" );
	var Rainbow = require( "rainbow" );

	var minSize = 5;
	var maxSize = 400;

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

			this.animate();
		},

		animate: function() {

			requestAnimationFrame( this.animate.bind( this ) );
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