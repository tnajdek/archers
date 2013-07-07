define(['jquery', 'lodash', 'vent'], function($, lodash, vent) {
	var Lobby = function() {
		this.show = function() {
			this.$lobby.show();
		}

		this.hide = function() {
			this.$lobby.hide();
		}

		this.init = function() {
			var that = this;
			this.$lobby = $('.lobby');

			this.$lobby.on('change', '.username', function(e) {
				vent.trigger('username', $(this).val());
			})

			this.$lobby.on('click', '.spawn', function() {
				vent.trigger('username', $('.username').val());
				vent.trigger('spawn');
			});

			this.$lobby.on('click', '.need-help', function() {
				$('.help').toggle();
			});

			vent.on('connected', function() {
				that.$lobby.find('.status').text("Connected :)");
				that.$lobby.find('.spawn').show();
			});
			vent.on('disconnected', function() {
				that.$lobby.show();
				that.$lobby.find('.status').text("Connection lost :(");
				that.$lobby.find('.spawn').hide();
			});
		}
	};

	return new Lobby();
});