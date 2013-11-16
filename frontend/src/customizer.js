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
				$customiser = $('.customiser'),
				slotData = {},
				ractive;

			_.each(data.slots, function(slotname, slotid) {
				slotData[slotid] = {
					'name': slotname,
					'id': slotid
				};
			});

			ractive = new Ractive({
				el: $customiser[0],
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

			ractive.observe('slotData', function(newValue) {
				var slots = {};
				slots['gender'] = ractive.get('gender');
				_.each(newValue, function(val, key) {
					if(val.selectedVariant) {
						slots[key] = [val.selectedItem, val.selectedVariant];
					} else {
						slots[key] = val.selectedItem;
					}
				});
				vent.trigger('customize:change', slots);
			});

			ractive.on('update', function() {
				
			});

			vent.on('customize', function() {
				var slots = {};
				slots['gender'] = ractive.get('gender');
				_.each(ractive.get('slotData'), function(val, key) {
					if(val.selectedVariant) {
						slots[key] = [val.selectedItem, val.selectedVariant];
					} else {
						slots[key] = val.selectedItem;
					}
				});
				vent.trigger('customize:change', slots);
				$customiser.show();
			});

			vent.on('endcustomize', function(items) {
				$customiser.hide();
			});
		};
	};

	return new Customizer();
});