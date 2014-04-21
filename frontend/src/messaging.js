define(['require', 'lodash', 'messaging/frame', 'messaging/update', 'messaging/useraction', 'messaging/remove', 'messaging/event'],
function(require, _, FrameMessage, UpdateMessage, UserActionMessage, RemoveMessage, EventMessage) {
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
			'1': FrameMessage,
			'2': UpdateMessage,
			'3': UserActionMessage,
			'4': RemoveMessage,
			'5': EventMessage
		},

		copyBytes: function(aSource, aTarget, aSourceOffset, aTargetOffset, aLength) {
			var view = new Uint8Array(aTarget, aTargetOffset);
			view.set(new Uint8Array(aSource, aSourceOffset, aLength));
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
		},

		toBuffer: function(messages) {
			var byteCount = 1,
				bytePointer = 0,
				messagesType, buffer, dv, messageByteLength, msg;

			if(messages.length) {
				messagesType = this.messages[messages[0].constructor.schema.id];
				messageByteLength = this.calcByteSize(messages[0].constructor.schema);
				byteCount += messages.length*messageByteLength;
				buffer = new ArrayBuffer(byteCount);
				dv = new DataView(buffer);
				dv.setUint8(0, messages[0].constructor.schema.id);
				bytePointer = 1;
				while(messages.length) {
					msg = messages.shift();
					this.copyBytes(msg.toBuffer(), buffer, 0, bytePointer, messageByteLength);
					bytePointer += messageByteLength;
				}
				return buffer;
			} else {
				return new ArrayBuffer(0);
			}
		}
	};
	return Messaging;
});
