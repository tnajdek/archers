define(['test/chai', 'messaging', 'messaging/message'],
function(chai, Messaging, Message) {
	var assert = chai.assert,
		schema = {
			id: 255,
			format: ['a', 'b'],
			byteformat: 'If'
		},
		FakeMessage = Message.from(schema);

	Messaging.messages['255'] = FakeMessage;

	describe("Messaging", function() {
		it('should parse array buffer into message object', function() {
			var message, messages,
				buffer = new ArrayBuffer(1+4+4+4+4),
				dv = new DataView(buffer);
			dv.setUint8(0, 255);
			dv.setUint32(1, 123);
			dv.setFloat32(5, 1.23);

			dv.setUint32(9, 999999);
			dv.setFloat32(13, 89.11);

			messages = Messaging.fromBuffer(buffer);
			assert.equal(messages.length, 2);
			message = messages[0];
			assert.instanceOf(message, FakeMessage);
			assert.equal(message.a, 123);
			assert.closeTo(message.b, 1.23, 0.1);
			message = messages[1];
			assert.equal(message.a, 999999);
			assert.closeTo(message.b, 89.11, 0.1);
		});

		it('should build array buffer out of messages', function() {
			var msg = new FakeMessage({
				id: 255,
				a: 42,
				b: 4.2
			}),
				buffer = Messaging.toBuffer([msg]),
				dv;

			assert.instanceOf(buffer, ArrayBuffer);
			assert.equal(buffer.byteLength, 1+4+4);
			dv = new DataView(buffer);

			assert.equal(dv.getUint8(0), 255);
			assert.equal(dv.getUint32(1), 42);
			assert.closeTo(dv.getFloat32(5), 4.2, 0.1);
		});
	});
});


