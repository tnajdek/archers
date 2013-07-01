define(function() {
	return {
			directionLookup: {
				0: '',
				1: 'N',
				2: 'S',
				3: 'E',
				4: 'W'
			},

			hydrateDirection: function(value) {
				return this.directionLookup[value];
			}
			//@TODO: dehydrate for completness sake
	};
});