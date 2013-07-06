define(['lodash'], function(_) {
	var directionLookup = {
			0: '',
			1: 'N',
			2: 'S',
			3: 'E',
			4: 'W'
		},
		directionRLookup = _.invert(directionLookup);
	return {
		directionLookup: directionLookup,
		directionRLookup: directionRLookup,
			hydrateDirection: function(value) {
				return this.directionLookup[value];
			},
			dehydrateDirection: function(value) {
				return this.directionRLookup[value];
			}
	};
});