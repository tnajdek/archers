define(function() {
	return {
			stateLookup: {
				0: 'unknown',
				1: 'standing',
				2: 'walking',
				3: 'shooting',
				4: 'dying',
				5: 'dead'
			},

			hydrateState: function(value) {
				return this.stateLookup[value];
			}
			//@TODO: dehydrate for completness sake
	};
});