define(function() {
	return {
			typeLookup: {
				0: 'unknown',
				1: 'deflect'
			},

			hydrateType: function(value) {
				return this.typeLookup[value];
			}
			//@TODO: dehydrate for completness sake
	};
});