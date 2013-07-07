define(['jquery', 'lodash', 'vent'], function($, lodash, vent) {
	var Lobby = function() {
		this.show = function() {
			this.$lobby.show();
		};

		this.hide = function() {
			this.$lobby.hide();
		};

		this.updatedLeaderBoard = function() {
			var that = this,
				ldTable = $('<table/>'),
				headrow = "<tr><td>Pos</td><td>Player</td><td>Kills</td><td>Deaths</td><td>Score</td></tr>",
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
		};

		this.getRandomName = function() {
			var names = ["Aayla Secura", "Ackbar", "Isard", "Motti", "Ahsoka Tano", "Anakin Solo", "Asajj", "Ventress", "Aurra Sing", "Bail Organa", "Barriss", "Offee", "Bastila Shan", "Bib Fortuna", "Biggs", "Boba Fett", "Bossk", "Boss Nass", "C3P0", "Cad Bane", "Ordo", "Captain Rex", "Chewbacca", "Cody", "Count Dooku", "Dak", "Bane", "Krayt", "Malak", "Maul", "Nihilus", "Revan", "Sion", "Traya", "Vader", "Dash Rendar", "Dengar", "Desann", "Evazan", "Durge", "Palpatine", "Exar Kun", "Grievous", "General", "Madine", "Gilad", "Pellaeon", "Thrawn", "Greedo", "Han Solo", "HK-47", "Hondo Ohnaka", "IG-88", "Jabba", "Jacen Solo", "Jaina Solo", "Jango Fett", "Jaxxon", "Jek Porkins", "Jerec", "Joruus C'baoth", "Ki-Adi-Mundi", "Kir Kanos", "Kit Fisto", "Kyle Katarn", "Lando", "Calrissian", "Lobot", "Skywalker", "Luminara", "Unduli", "Lumiya", "Mace Windu", "Mara Jade", "Max Rebo", "Mon Mothma", "Natasi Daala", "Nien Nunb", "Noa", "Briqualon", "Obi-Wan Kenobi", "Oola", "Amidala", "Plo Koon", "Leia", "Prince Xizor", "PROXY", "Qui-Gon Jinn", "Quinlan Vos", "R2-D2", "Salacious", "Sebulba", "Shaak Ti", "Starkiller", "Talon Karrde", "Uncle Owen", "Watto", "Antilles", "Wicket", "Yaddle", "Yoda", "Zam Wesell"],
				prefix = ["Darth", "Commander", "Lord", "Emperor", "Duke"],
				random_name = names[_.random(names.length-1)],
				random_prefix = prefix[_.random(prefix.length-1)],
				random_long_name = random_prefix + ' ' + random_name;

			return random_long_name.length > 12 ? random_name : random_long_name;
		};

		this.init = function() {
			var that = this;
			this.metacollector = {};
			this.leaderboardEntryTpl = _.template("<tr><td><%- position %></td><td><%- username %></td><td><%- kills %></td><td><%- deaths %></td><td><%- score %></td></tr>");
			
			if(!$('.username').val().length) {
				$('.username').val(this.getRandomName());
			}

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

				//one time update
				_.delay(function() {
					vent.trigger('username', $('.username').val());
				}, 100);

				//ready to spawn
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