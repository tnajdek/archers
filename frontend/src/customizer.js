define(['lodash',
	'jquery',
	'lodash',
	'vent',
	'text!templates/slot-selector.html',
	'text!templates/item-option.html',
	'text!templates/variant-selector.html',
	], function(_, $, lodash, vent, slotSelectorTpl, itemOptionTpl, variantSelectorTpl) {
	var Customizer = function() {
		var slotSelector = _.template(slotSelectorTpl),
			itemOption = _.template(itemOptionTpl),
			variantSelector = _.template(variantSelectorTpl);

		this.show = function() {
			this.$customiser.show();
		};

		this.hide = function(hideTrayButton) {
			this.$customiser.hide();
		};

		this.selectors = function(data) {
				var that = this,
					$container = this.$customiser.find('.selectors'),
					$tag = $('#slot-selector-gender').closest('div'),
					gender;

			if(!$tag.length) {
				$tag = $(slotSelector({name: "Gender", slotId: "gender"}));
				$container.append($tag);
				_.each(['male', 'female'], function(item) {
					var optionTag = itemOption({
						id: item,
						name:item.charAt(0).toUpperCase()+item.slice(1)
					});
					$tag.find('select').append(optionTag);
				});
			}

			gender = $tag.find('select').val();

			_.each(data.slots, function(value, index) {
				var $tag = $('#slot-selector-'+index).closest('div'),
					$variantSelector, $slotSelector, predefinedValue,
					predefinedVariant;

				if(!$tag.length) {
					$tag = $(slotSelector({name: value, slotId: index}));
					$container.append($tag);
				}
				$slotSelector = $tag.find('.slot-selector');
				$variantSelector = $tag.find('.variant-selector');

				predefinedValue = $slotSelector.val();
				predefinedVariant = $variantSelector.val();
				$slotSelector.empty();
				$variantSelector.empty();


				index = parseInt(index, 10);
				_.each(data.items, function(item, itemId) {
					var optionTag, variantTag;
					if(item.slot === index && _.contains(item.genderRestrictions, gender)) {
						optionTag = itemOption({id: itemId, name:item.name });
						$slotSelector.append(optionTag);
						if(item.variants) {
							if(!$variantSelector.length) {
								$variantSelector = $(variantSelector({name: value+'-variant', slotId: index}));
								$slotSelector.after($variantSelector);
							}
							$variantSelector.empty();
							_.each(item.variants, function(variantValue, variantName) {
								variantTag = itemOption({id:variantName, name:variantName});
								$variantSelector.append(variantTag);
							});
						} else if($variantSelector.length) {
							$variantSelector.remove();
						}
					}
				});

				if(predefinedValue) {
					$slotSelector.val(predefinedValue);
				}

				if(predefinedVariant) {
					$variantSelector.val(predefinedVariant);
				}
			});
		};

		this.init = function() {
			var that = this,
				data = pc.device.loader.get('items').resource.data;
				
			this.$customiser = $('.customiser');
			this.selectors(data);

			this.$customiser.on('change', 'select', function() {
				var selectedItems = {};
				that.selectors(data);

				$('.slot-selector').each(function(i, select) {
					var $select = $(select),
						slotId = $select.data('slotId'),
						$variantSelector = $('#variant-selector-'+slotId);

					if($variantSelector.length) {
						selectedItems[slotId] = [$select.val(), $variantSelector.val()];
					} else {
						selectedItems[slotId] = $select.val();
					}
				});
				vent.trigger('customize:change', selectedItems);
			});

			vent.on('customize', function() {
				that.$customiser.show();
			});
			vent.on('endcustomize', function() {
				that.$customiser.hide();
			});

			this.$customiser.on('click', '.exit', function() {
				vent.trigger('endcustomize');
			});
		};
	};

	return new Customizer();
});