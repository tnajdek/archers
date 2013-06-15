define(['messaging/message'], function(Message) {
	var schema = {
		id: 2,
		format: ['id', 'center', 'remove'],
		byteformat: 'I??'
	};

	var UpdateMessage = Message.from(schema);
	return UpdateMessage;
});