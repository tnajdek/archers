define(['messaging/message'], function(Message) {
	var schema = {
		format: ['id', 'x', 'y', 'direction', 'state'],
		byteformat: 'IffBB'
	};

	var FrameMessage = Message.from(schema);
	return FrameMessage;
});