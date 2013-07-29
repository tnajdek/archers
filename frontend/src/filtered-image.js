	define(['lodash', 'pc'], function(_, pc) {
	return pc.Image.extend('pc.Image.Filtered',
		{

			hex2rgb: function(hex) {
				var bigint = parseInt(hex, 16),
					r = (bigint >> 16) & 255;
					g = (bigint >> 8) & 255;
					b = bigint & 255;
				return [r, g, b];
			},

			multiplyPixel: function(topValue, bottomValue) {
				return topValue * bottomValue / 255;
			}
		},
		{
			// @TODO: optimise (single array pass etc.)
			init: function (name, source, filters) {
				var canvas, ctx, image, images = [];

				image = pc.device.loader.get(source).resource;
				this.image = canvas = document.createElement('canvas');
				this.width = canvas.width = image.width;
				this.height = canvas.height = image.height;
				this.ctx = ctx = canvas.getContext('2d');
				ctx.drawImage(image.image, 0,0);

				if(filters) {
					this.applyFilters(filters);
				}

				this.name = name;
				this.scaleX = 1;
				this.scaleY = 1;
				this.alpha = 1;
				this.loaded = true;
			},

			load: function() {
				// no need for that sir
			},

			applyFilters: function(filters) {
				var that = this;
				// [{"multiply": "aabbcc", "tint":"ffffff"}, {"multiply":"123456"}]
				_.each(filters, function (filterDef) {
					_.each(filterDef, function(value, filter) {
						if(filter === 'multiply') {
							that.multiply(value);
						}
					});
				});
			},

			multiply: function(multiplyColor) {
					// OMG SOOOOOO SLOOOOOOOOOW
				var imageData = this.ctx.getImageData(0, 0, this.image.width, this.image.height),
					pix = imageData.data;

				if(!_.isArray(multiplyColor)) {
					multiplyColor = this.Class.hex2rgb(multiplyColor);
				}
				// Loop over each pixel and change the color.
				
				// naive and so freaking SLOOOOOOOOOOOOW!!!
				for (var i = 0, n = pix.length; i < n; i += 4) {
					if(pix[i  ] !== 0) {
						// debugger;
					}
					pix[i  ] = this.Class.multiplyPixel(multiplyColor[0], pix[i  ]); // red
					pix[i+1] = this.Class.multiplyPixel(multiplyColor[1], pix[i+1]); // green
					pix[i+2] = this.Class.multiplyPixel(multiplyColor[2], pix[i+2]); // blue
					// pix[i+3] is alpha channel (ignored)
				}
/*				var pixels = new Int32Array( imageData.data.buffer );

				for (var y = 0; y < this.image.height; ++y) {
					for (var x = 0; x < this.image.width; ++x) {
						var value = x * y & 0xff;
						pixel = pixels[y * this.image.width + x]

						pixels[y * this.image.width + x] =
							(255   << 24) |    // alpha
							(value << 16) |    // blue
							(value <<  8) |    // green
							value;            // red
						}

						pixels[y * this.image.width + x] =
							(255   << 24) |    // alpha
							this.Class.multiplyPixel(multiplyColor[2], (value << 16)) |    // blue
							this.Class.multiplyPixel(multiplyColor[1], (value <<  8)) |    // green
							this.Class.multiplyPixel(multiplyColor[0], value);            // red
					}
				}

				var buf = new ArrayBuffer(imageData.data.length);
*/
				this.ctx.putImageData(imageData, 0, 0);
				// imageData.data.set(buf8);

			}
		}
	);
});