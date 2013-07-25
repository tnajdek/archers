define(['jquery', 'lodash', 'vent'], function($, lodash, vent) {
	var Customizer = function() {
		this.show = function() {
			this.$customiser.show();
		};

		this.hide = function(hideTrayButton) {
			this.$customiser.hide();
		};

		this.init = function() {
			var that = this;
			this.$customiser = $('.customiser');

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