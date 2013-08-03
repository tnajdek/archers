define(['lodash', 'pc', 'shader', 'text!shaders/space.vert', 'text!shaders/multiply.frag'],
function(_, pc, shader, spaceVertexShader, multiplyFragmentShader) {
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
			},

			multiplyFallback: function(src, multiplyColor) {
				// Very very slow, especially on FF. Will take few seconds to complete
				// while completely blocking the interface
				var canvas = document.createElement('canvas'),
					ctx, imageData, pix, pixLength;

				canvas.width = src.width;
				canvas.height = src.height;
				ctx = canvas.getContext('2d');

				ctx.drawImage(src, 0,0);
				imageData = ctx.getImageData(0, 0, src.width, src.height);
				pix = imageData.data;
				pixLength = pix.length;


				if(!_.isArray(multiplyColor)) {
					multiplyColor = this.hex2rgb(multiplyColor);
				}

				// Loop over each pixel and change the color.
				for (var i = 0, n = pixLength; i < n; i += 4) {
					pix[i  ] = this.multiplyPixel(multiplyColor[0], pix[i  ]); // red
					pix[i+1] = this.multiplyPixel(multiplyColor[1], pix[i+1]); // green
					pix[i+2] = this.multiplyPixel(multiplyColor[2], pix[i+2]); // blue
					// pix[i+3] is alpha channel (ignored)
				}
				ctx.putImageData(imageData, 0, 0);
				return canvas;
			},

			multiplyGL: function(src, multiplyColor) {
				var arguments;

				if(!_.isArray(multiplyColor)) {
					multiplyColor = this.hex2rgb(multiplyColor);
				}

				arguments = {
					"r": multiplyColor[0],
					"g": multiplyColor[1],
					"b": multiplyColor[2]
				};

				return shader(src, spaceVertexShader, multiplyFragmentShader, arguments);

			},

			copyImage: function(src) {
				var canvas = document.createElement('canvas'),
					ctx;

				canvas.width = src.width;
				canvas.height = src.height;
				ctx = canvas.getContext('2d');
				ctx.drawImage(src, 0,0);

				return canvas;
			}
		},
		{
			// @TODO: optimise (single array pass etc.)
			init: function (name, source, filters) {
				var canvas, ctx, image, images = [];

				image = pc.device.loader.get(source).resource;
				this.image = image;
				this.width = image.width;
				this.height = image.height;

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
				try {
					this.image = this.Class.multiplyGL(this.image.image, multiplyColor);
				} catch(e) {
					this.image = this.Class.multiplyFallback(this.image.image, multiplyColor);
				}
			}
		}
	);
});