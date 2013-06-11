define(['require', 'messaging/frame'], function(require, FrameMessage) {
	var Messaging = {
		format: {
			'b': 'Int8',
			'B': 'Uint8',
			'?': 'Uint8',
			'h': 'Int16',
			'H': 'Uint16',
			'i': 'Int32',
			'I': 'Uint32',
			'f': 'Float32',
			'd': 'Float64'
		},

		messages: {
			'1': FrameMessage
		},


		getTypeByteLength: function(format) {
			// aaaaah did I just use 'window' there?
			return window[format+'Array'].BYTES_PER_ELEMENT;
		},

		calcByteSize: function(schema) {
			var total = 0, pointer = 0, type;

			while(pointer < schema.byteformat.length) {
				type = this.format[schema.byteformat.charAt(pointer)];
				total += this.getTypeByteLength(type);
				pointer++;
			}
			return total;
		},

		extractValue: function(value, schemaType) {
			if(schemaType === '?') {
				value = !!value;
			}
			return value;
		},

		fromBuffer: function(buffer) {
			var dv = new DataView(buffer),
				messagesType = this.messages[dv.getUint8(0)],
				messageByteLength = this.calcByteSize(messagesType.schema),
				pointer = 1, message, messages = [];

			while(pointer < buffer.byteLength) {
				message = new messagesType(buffer.slice(pointer, pointer + messageByteLength));
				messages.push(message);
				pointer += messageByteLength;
			}
			return messages;
		}

	};
	return Messaging;
});
