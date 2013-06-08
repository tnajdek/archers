
describe('FrameMessage', function() {
	it('should parse array buffer into message object', function() {
		var buffer = new ArrayBuffer(14);
		// phantom js can't do this, argh!
		var id = new Uint32Array(buffer, 0, 1);
		var x = new Float32Array(buffer, 4, 1);
		var y = new Float32Array(buffer, 8, 1);
		var direction = new Uint8Array(buffer, 12, 1);
		var state = new Uint8Array(buffer, 13, 1);

		id[0] = 123;
		x[0] = 1.25;
		y[0] = 2.25;
		direction[0] = 1;
		state[0] = 10;

		message = new FrameMessage(buffer);
		assert.equal(message.id, 1);
		assert.equal(message.x, 1.25);
		assert.equal(message.y, 2.25);
		assert.equal(message.direction, 1);
		assert.equal(message.state, 10);	
	});
});
