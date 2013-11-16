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
				tplData = {};

			// tplData.slots = {};
			// _.each(data.items, function(itemid, item) {
			// 	if(!tplData.slots[data.slots[item['slot']]]) {
			// 		tplData.slots[data.slots[item['slot']]] = [];
			// 	}
			// 	tplData.slots[data.slots[item['slot']]].push(item);
			// });

			new Ractive({
				el: $container[0],
				template: customizerTpl,
				data: {
					data: data,
					filterSlot: function ( item, value ) {
						
						return item.slot == value;
					},
					filterGender: function( item, gender) {
						if(!item.genderRestrictions) {
							return true;
						} else {
							return _.contains(item.genderRestrictions, gender);
						}
					}
				}
			});
			$container.show();
		};
	};

	return new Customizer();
});