define(['lodash',
	'jquery',
	'lodash',
	'vent',
	'ractive',
	'text!templates/customizer-form.html'
	], function(_, $, lodash, vent, Ractive, customizerTpl) {
	var Customizer = function() {
		this.init = function() {
			var that = this,
				data = pc.device.loader.get('items').resource.data,
				$container = $('.customiser'),
				slotData = {};

			_.each(data.slots, function(slotname, slotid) {
				slotData[slotid] = {
					'name': slotname,
					'id': slotid
				};
			});

			new Ractive({
				el: $container[0],
				template: customizerTpl,
				data: {
					data: data,
					slotData: slotData,
					filterSlot: function ( item, value ) {
						
						return item.slot == value;
					},
					filterGender: function( item, gender) {
						if(!item.genderRestrictions) {
							return true;
						} else {
							return _.contains(item.genderRestrictions, gender);
						}
					},
					stringify: function(item) {
						return JSON.stringify(item);
					},
					isEmpty: _.isEmpty
				}
			});
			$container.show();
		};
	};

	return new Customizer();
});