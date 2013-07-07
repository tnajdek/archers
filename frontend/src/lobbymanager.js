define(['jquery', 'lodash', 'vent'], function($, lodash, vent) {
	var Lobby = function() {
		this.show = function() {
			this.$lobby.show();
		}

		this.hide = function() {
			this.$lobby.hide();
		}

		this.updatedLeaderBoard = function() {
			var that = this,
				ldTable = $('<table/>'),
				headrow = "<tr><td>Pos</td><td>Player</td><td>Kills</td><td>Deaths</td><td>Score</td></tr>"
				players = _.map(this.metacollector, function(meta, id) {
				return meta;
			}),
				players = _.sortBy(players, "score");

			ldTable.append(headrow);
			_.each(players, function(player, index) {
				player.position = index+1;
				ldTable.append(that.leaderboardEntryTpl(player));
			});
			this.$leaderboard.html(ldTable);
		}

		this.init = function() {
			var that = this;
			this.metacollector = {};
			this.leaderboardEntryTpl = _.template("<tr><td><%- position %></td><td><%- username %></td><td><%- kills %></td><td><%- deaths %></td><td><%- score %></td></tr>");

			this.$lobby = $('.lobby');
			this.$leaderboard = this.$lobby.find('.leaderboard');

			this.$lobby.on('change', '.username', function(e) {
				vent.trigger('username', $(this).val());
			});

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

			vent.on('meta', function(meta) {
				that.metacollector[meta.id] = meta;
				that.updatedLeaderBoard();
			});
			vent.on('remove', function(msg) {
				if(that.metacollector[msg.id]) {
					delete that.metacollector[msg.id];
					that.updatedLeaderBoard();
				}
			});
		}
	};

	return new Lobby();
});