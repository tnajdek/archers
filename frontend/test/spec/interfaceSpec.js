define(['test/chai', 'messaging', 'messaging/message'],
function(chai, Messaging, Message) {
	var assert = chai.assert;
	describe("Messaging", function() {
		it('should parse array buffer into message object', function() {
			// var message, messages,
			// 	buffer = new ArrayBuffer(29),
			// 	dv = new DataView(buffer),
			// 	schema = {
			// 		id: 1,
			// 		format: ['a', 'b', 'c'],
			// 		byteformat: 'IBf'
			// 	},
			// 	FakeMessage = Message.from(schema);

			// dv.setUint8(0, 1);
			// dv.setUint32(1, 123);
			// dv.setFloat32(5, 1.23);

			// dv.setUint32(9, 999999);
			// dv.setUint32(13, 89.11);

			// messages = Messaging.fromBuffer(buffer);

			// assert.equal(messages.length, 2);
			// message = messages[0];

			// assert.instanceOf(message, FrameMessage);

			// assert.equal(message.id, 123);
			// assert.equal(message.x, 1);
			// assert.equal(message.y, 2);
			// assert.equal(message.direction, 1);
			// assert.equal(message.state, 10);

			// message = messages[1];

			// assert.equal(message.id, 999999);
			// assert.equal(message.x, 89);
			// assert.equal(message.y, 11);
		});

		it('should build array buffer out of messages', function() {
			var msg = new FrameMessage({
				id: 123,
				x: 1.25,
				y: 2.25,
				direction: 1,
				state: 10
			}),
				buffer = Messaging.toBuffer([msg]),
				dv;

			assert.instanceOf(buffer, ArrayBuffer);
			assert.equal(buffer.byteLength, 15);
			dv = new DataView(buffer);

			console.log(dv.getUint32(0));

			assert.equal(dv.getUint8(0), 1);
			assert.equal(dv.getUint32(1), 123);
			assert.equal(dv.getFloat32(5), 1.25);
			assert.equal(dv.getFloat32(9), 2.25);
			assert.equal(dv.getUint8(13), 1);
			assert.equal(dv.getUint8(14), 10);
		});
	});
	describe('FrameMessage', function() {
		it('Should build ArrayBuffer from message', function() {
			var msg = new FrameMessage({
				id: 123,
				x: 1.25,
				y: 2.25,
				direction: 1,
				state: 10
			}),
				buffer = msg.toBuffer(),
				dv;

			assert.instanceOf(buffer, ArrayBuffer);
			assert.equal(buffer.byteLength, 14);
			dv = new DataView(buffer);

			assert.equal(dv.getUint32(0), 123);
			assert.equal(dv.getFloat32(4), 1.25);
			assert.equal(dv.getFloat32(8), 2.25);
			assert.equal(dv.getUint8(12), 1);
			assert.equal(dv.getUint8(13), 10);
		});
	});
});


