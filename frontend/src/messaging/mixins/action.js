define(['lodash'], function(_) {
	var actionLookup = {
			0:'init',
			1:'spawn',
			2:'stop',
			3:'move',
			4:'attack',
			5:'suicide'
		},
		actionRLookup = _.invert(actionLookup),
		actionMixin = {
			actionLookup: actionLookup,
			actionRLookup: actionRLookup,
			
			hydrateAction: function(value) {
				return this.actionLookup[value];
			},

			dehydrateAction: function(value) {
				return this.actionRLookup[value];
			}
	};
	return actionMixin;
});