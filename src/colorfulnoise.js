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
		}
	}

	//exporting other libraries
	ColorfulNoise.Noise = Noise;
	ColorfulNoise.Rainbow = Rainbow;

	module.exports = ColorfulNoise;
} )();