define(['lodash',
	'jquery',
	'lodash',
	'vent',
	'text!templates/slot-selector.html',
	'text!templates/item-option.html',
	'text!templates/variant-selector.html',
	], function(_, $, lodash, vent, slotSelectorTpl, itemOptionTpl, variantSelectorTpl) {
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
				itemOption = _.template(itemOptionTpl),
				variantSelector = _.template(variantSelectorTpl),
				$tag = $(slotSelector({name: "Gender", slotId: "gender"}));

			this.$customiser = $('.customiser');

			_.each(['male', 'female'], function(item) {
				var optionTag = itemOption({
					id: item,
					name:item.charAt(0).toUpperCase()+item.slice(1)
				});
				$tag.find('select').append(optionTag);
			});
			that.$customiser.append($tag);

			_.each(data.slots, function(value, index) {
				var $tag = $(slotSelector({name: value, slotId: index})),
					$variantSelector;

				index = parseInt(index, 10);
				that.$customiser.append($tag);
				_.each(data.items, function(item, itemId) {
					var optionTag, variantTag;
					if(item.slot === index) {
						optionTag = itemOption({id: itemId, name:item.name });
						$tag.find('select').append(optionTag);
						if(item.variants) {
							$variantSelector = $tag.find('.variant-selector');
							if(!$variantSelector.length) {
								$variantSelector = $(variantSelector({name: value+'-variant', slotId: index}));
								$tag.find('.slot-selector').after($variantSelector);
							}
							_.each(item.variants, function(variantValue, variantName) {
								variantTag = itemOption({id:variantName, name:variantName});
								$variantSelector.append(variantTag);
							});
						}
					}
				});
			});

			this.$customiser.on('change', 'select', function() {
				var selectedItems = {};
				$('.slot-selector').each(function(i, select) {
					var $select = $(select);
						slotId = $select.data('slotId'),
						$variantSelector = $('#variant-selector-'+slotId);

					if($variantSelector.length) {
						selectedItems[slotId] = [$select.val(), $variantSelector.val()];
					} else {
						selectedItems[slotId] = $select.val();
					}
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