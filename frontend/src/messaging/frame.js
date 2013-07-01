define(['lodash', 'messaging/message', 'messaging/mixins/entity', 'messaging/mixins/state', 'messaging/mixins/direction'],
	function(_, Message, entityMixin, stateMixin, directionMixin) {
		var schema = {
			id: 1,
			format: ['id', 'x', 'y', 'direction', 'state'],
			byteformat: 'IIIBB'
		};

		var FrameMessage = Message.from(schema, _.extend({}, stateMixin, directionMixin));
		return FrameMessage;
	}
);