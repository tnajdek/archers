define(['messaging/message'], function(Message) {
	var schema = {
		id: 2,
		format: ['id', 'entityType', 'remove'],
		byteformat: 'IB?'
	},
		base = {
			entityTypeLookup: {
				0: 'unknown',
				1: 'collidable',
				2: 'player',
				3: 'arrow'
			},

			hydrateEntityType: function(value) {
				return this.entityTypeLookup[value];
			}
			//@TODO: dehydrate for completness sake
	};

	var UpdateMessage = Message.from(schema, base);

	return UpdateMessage;
});