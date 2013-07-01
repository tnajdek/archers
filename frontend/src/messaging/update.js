define(['lodash', 'messaging/message', 'messaging/mixins/entity', 'messaging/mixins/state', 'messaging/mixins/direction'],
	function(_, Message, entityMixin, stateMixin, directionMixin) {
	var schema = {
		id: 2,
		format: ['id', 'entityType', 'width', 'height', 'x', 'y', 'direction', 'state'],
		byteformat: 'IBIIIIBB'
	};

	var UpdateMessage = Message.from(schema, _.extend({}, entityMixin, stateMixin, directionMixin));

	return UpdateMessage;
});