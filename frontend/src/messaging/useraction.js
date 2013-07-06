define(['lodash', 'messaging/message', 'messaging/mixins/action', 'messaging/mixins/direction'],
	function(_, Message, actionMixin, directionMixin) {
	var schema = {
		id: 3,
		format: ['action', 'direction'],
		byteformat: 'BB'
	};

	var UserActionMessage = Message.from(schema, _.extend({}, actionMixin, directionMixin));
	return UserActionMessage;
});