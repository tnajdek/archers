define(['lodash',
	'jquery',
	'lodash',
	'vent',
	'text!templates/slot-selector.html',
	'text!templates/item-option.html'
	], function(_, $, lodash, vent, slotSelectorTpl, itemOptionTpl) {
	var Customizer = function() {
		this.show = function() {
			this.$customiser.show();
		};

		this.hide = function(hideTrayButton) {
			this.$customiser.hide();
		};

		this.init = function() {
			var that = this,
				data = pc.device.loader.get('items').resource.data,
				slotSelector = _.template(slotSelectorTpl),
				itemOption = _.template(itemOptionTpl);

			this.$customiser = $('.customiser');

			_.each(data.slots, function(value, index) {
				var $tag = $(slotSelector({name: value, slotId: index}));
				index = parseInt(index, 10);
				that.$customiser.append($tag);
				_.each(data.items, function(item, itemId) {
					var optionTag;
					if(item.slot === index) {
						optionTag = itemOption({id: itemId, name:item.name });
						$tag.find('select').append(optionTag);
					}
				});
			});

			this.$customiser.on('change', 'select', function() {
				var selectedItems = {};
				$('select').each(function(i, select) {
					var $select = $(select);
					selectedItems[$select.data('slotId')] = $select.val();
				});
				vent.trigger('customize:change', selectedItems);
			})



			vent.on('customize', function() {
				that.$customiser.show();
			});
			vent.on('endcustomize', function() {
				that.$customiser.hide();
			});

			this.$customiser.on('click', '.exit', function() {
				vent.trigger('endcustomize');
			});
		}
	};

	return new Customizer();
});