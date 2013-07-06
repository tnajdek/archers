define(['lodash', 'messaging'], function(_) {
	Message = function() {};

	Message.from = function(schema, base) {
		var base = base || {},
			prototype = new this(),
			MessageClass = function(buffer) {
			if(buffer instanceof ArrayBuffer) {
				var Messaging = require('messaging'),
					dv = new DataView(buffer),
					pointer = 0, bytePointer = 0,
					letterType, value, format, hydrator;

				while(pointer < schema.byteformat.length) {
					letterType = schema.byteformat.charAt(pointer);
					format = Messaging.format[letterType];

					value = Messaging.extractValue(dv['get'+format](bytePointer), letterType);
					hydrator = base['hydrate'+schema.format[pointer].charAt(0).toUpperCase() + schema.format[pointer].substring(1)];
					if(hydrator) {
						value = hydrator.call(base, value);
					}
					this[schema.format[pointer]] = value;

					bytePointer += Messaging.getTypeByteLength(format);
					pointer++;
				}
			} else {
				_.extend(this, buffer);
			}
		};

		prototype.toBuffer = function() {
			var Messaging = require('messaging'),
				bufferLength = Messaging.calcByteSize(schema),
				buffer = new ArrayBuffer(bufferLength),
				dv = new DataView(buffer),
				pointer = 0, bytePointer = 0,
				format, letterType, value, dehydrator;

			while(pointer < schema.byteformat.length) {
					letterType = schema.byteformat.charAt(pointer);
					format = Messaging.format[letterType];
					dehydrator = base['dehydrate'+schema.format[pointer].charAt(0).toUpperCase() + schema.format[pointer].substring(1)];
					if(dehydrator) {
						value = dehydrator.call(base, this[schema.format[pointer]]);
					} else {
						value = this[schema.format[pointer]];
					}
					dv['set'+format](bytePointer, value);
					bytePointer += Messaging.getTypeByteLength(format);
					pointer++;
				}
			return buffer;
		};

		prototype.schema = schema;

		MessageClass.prototype = prototype;
		MessageClass.prototype.constructor = MessageClass;
		MessageClass.extend = arguments.calee;
		MessageClass.schema = schema;
		return MessageClass;
	}

	return Message;
});