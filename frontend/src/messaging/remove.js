define(['messaging/message'], function(Message) {
	var schema = {
		id: 4,
		format: ['id'],
		byteformat: 'I'
	};

	return Message.from(schema);
});