define(['lodash'], function (_) {

	function loadShader(gl, shaderSource, shaderType) {
		var shader = gl.createShader(shaderType);

		// Load the shader source code
		gl.shaderSource(shader, shaderSource);

		// and compile
		gl.compileShader(shader);

		// and check if it worked
		if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			return shader;
		} else {
			console.error("Unable to compile shader " + shader + ": " + gl.getShaderInfoLog(shader));
			return null;
		}

	}

	function setRectangle(gl, x, y, width, height) {
		var x1 = x;
		var x2 = x + width;
		var y1 = y;
		var y2 = y + height;
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			x1, y1,
			x2, y1,
			x1, y2,
			x1, y2,
			x2, y1,
			x2, y2]), gl.STATIC_DRAW);
	}

	return function(image, vertexShaderSrc, fragmentShaderSrc, fragmentAttributes) {
		var canvas = document.createElement('canvas'),
			gl, positionLocation, texCoordLocation, texCoordBuffer,
			texture, resolutionLocation, buffer, vertexShader, fragmentShader,
			program, r, g, b, a;
		
		// set canvas size to image size and obtain webGL context
		canvas.width = image.width;
		canvas.height = image.height;

		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

		if (!gl) {
			throw "WebGL disabled or unavailable.";
		}
		
		// Compile shaders
		vertexShader = loadShader(gl, vertexShaderSrc, gl.VERTEX_SHADER);
		fragmentShader = loadShader(gl, fragmentShaderSrc, gl.FRAGMENT_SHADER);

		// prepare and link WebGL program using shaders we've compiled above
		program = gl.createProgram();
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);

		// check for any problems
		if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			throw "Unable to link program:" + gl.getProgramInfoLog(program);
		}

		// tell the browser to use program we've created
		gl.useProgram(program);

		// look up where the vertex data needs to go.
		positionLocation = gl.getAttribLocation(program, "a_position");
		texCoordLocation = gl.getAttribLocation(program, "a_texCoord");

		// provide texture coordinates for the rectangle.
		texCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			0.0,  0.0,
			1.0,  0.0,
			0.0,  1.0,
			0.0,  1.0,
			1.0,  0.0,
			1.0,  1.0]), gl.STATIC_DRAW);
		gl.enableVertexAttribArray(texCoordLocation);
		gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

		// Create a texture.
		texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);

		// Set the parameters so we can render any size image.
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

		// Upload the image into the texture.
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

		// lookup uniforms
		resolutionLocation = gl.getUniformLocation(program, "u_resolution");

		// set the resolution
		gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

		// Create a buffer for the position of the rectangle corners.
		buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.enableVertexAttribArray(positionLocation);
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

		// Set a rectangle the same size as the image.
		setRectangle(gl, 0, 0, image.width, image.height);

		_.each(fragmentAttributes, function(value, name) {
			var location = gl.getUniformLocation(program, name);
			value = value%256/255;
			gl.uniform1f(location, value);
		});

		// Draw the rectangle.
		gl.drawArrays(gl.TRIANGLES, 0, 6);
		return canvas;
	};
});