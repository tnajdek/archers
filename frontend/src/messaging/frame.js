define(['require'], function(require) {
	var schema = {
		format: ['id', 'x', 'y', 'direction', 'state'],
		byteformat: 'IffBB'
	};
	var FrameMessage = function(buffer) {
		var Messaging = require('messaging'),
			dv = new DataView(buffer),
			pointer = 0, bytePointer = 0,
			letterType, type, typedArray, value;

		while(pointer < schema.byteformat.length) {
			letterType = schema.byteformat.charAt(pointer);
			format = Messaging.format[letterType];

			value = Messaging.extractValue(dv['get'+format](bytePointer), letterType);
			this[schema.format[pointer]] = value;

			bytePointer += Messaging.getTypeByteLength(format);
			pointer++;
		}
	};

	FrameMessage.schema = schema;
	return FrameMessage;
});