define(['jquery',
		'lodash',
		'vent',
		'ractive',
		'text!templates/lobby.html'
	], function($, lodash, vent, Ractive, lobbyTpl) {
	var Lobby = function() {
		this.show = function() {
			this.$lobby.show();
			// this.$button.hide();
		};

		this.hide = function(hideTrayButton) {
			this.$lobby.hide();
			// if(!hideTrayButton) {
			// 	this.$button.show();
			// }
		};

		// this.updatedLeaderBoard = function() {
		// 	var that = this,
		// 		ldTable = $('<table/>'),
		// 		headrow = "<tr><td>Pos</td><td>Player</td><td>Kills</td><td>Deaths</td><td>Score</td></tr>",
		// 		players = _.map(this.metacollector, function(meta, id) {
		// 			return meta;
		// 		}),
		// 		players = _.sortBy(players, "score").reverse();


		// 	ldTable.append(headrow);
		// 	_.each(players, function(player, index) {
		// 		player.position = index+1;
		// 		ldTable.append(that.leaderboardEntryTpl(player));
		// 	});
		// 	this.$leaderboard.html(ldTable);
		// };



		this.init = function() {
			var that = this
				localAccount = localStorage.getObject('account');

			this.$lobby = $('.lobby');
			this.metacollector = {};

			// this.$lobby.on('change', '.username', function(e) {
			// 	vent.trigger('username', $(this).val());
			// });

			// this.$lobby.on('click', '.spawn', function() {
			// 	vent.trigger('username', $('.username').val());
			// 	vent.trigger('spawn');
			// });

			// this.$lobby.on('click', '.customize', function() {
			// 	vent.trigger('customize');
			// });

			vent.on('connected', function() {
				that.ractive.set('status', 'connected');
				if(localAccount) {
					// send local data to the server
					_.delay(function() {
						vent.trigger('localAccountFound', localAccount);
					}, 100);
				}
			});

			vent.on('disconnected', function() {
				that.$lobby.show();
				that.ractive.set('status', "disconnected");
			});

			vent.on('meta', function(meta) {
				that.metacollector[meta.id] = meta;
				that.ractive.set('players', that.metacollector);
				
			});
			vent.on('remove', function(msg) {
				if(that.metacollector[msg.id]) {
					delete metacollector[msg.id];
					that.ractive.set('players', that.metacollector);
				}
			});

			vent.on('player-has-spawned', function() {
				that.hide();
				// $('.spawn').text('Suicide');
				// $('.username').attr('disabled', true);
			});

			vent.on('player-has-died', function() {
				that.show();
				// $('.spawn').text('Play!');
				// $('.username').attr('disabled', false);
			});

			vent.on('customize:end', function() {
				localAccount = localStorage.getObject('account');
				that.ractive.set('account', localAccount);
			});

			this.ractive = new Ractive({
				el: this.$lobby[0],
				template: lobbyTpl,
				data: {
					players: this.metacollector,
					account: localAccount,
					status: 'connecting...',
					sort: function(players) {
						//sort players by score desc
						return _.sortBy(_.map(players, function(meta, id) {
							return meta;
						}), "score").reverse();
					}
				}
			});

			this.ractive.on('customize', function() {
				vent.trigger('customize');
			});

			this.ractive.on('spawn', function() {
				vent.trigger('spawn');
			});
		};
	};

	return new Lobby();
});