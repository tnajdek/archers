precision mediump float;

// our texture
uniform sampler2D u_image;
uniform float r;
uniform float g;
uniform float b;

// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;

void main() {
	vec4 color = texture2D(u_image, v_texCoord);
	vec4 mbc = vec4(r, g, b, 1.0);
	gl_FragColor = color * mbc;
}