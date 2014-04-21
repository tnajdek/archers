define(['lodash', 'messaging/message', 'messaging/mixins/event_type'],
	function(_, Message, eventTypeMixin) {
		var schema = {
			id: 5,
			format: ['id', 'x', 'y'],
			byteformat: 'III'
		};

		var EventMessage = Message.from(schema, _.extend({}, eventTypeMixin));
		return EventMessage;
	}
);