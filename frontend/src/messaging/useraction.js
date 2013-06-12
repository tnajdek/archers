define(['messaging/message'], function(Message) {
	var schema = {
		id: 3,
		format: ['action', 'direction'],
		byteformat: 'BB'
	};

	var UserActionMessage = Message.from(schema);
	return UserActionMessage;
});