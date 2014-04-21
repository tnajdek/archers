define(['lodash',
	'jquery',
	'lodash',
	'vent',
	'ractive',
	'lobbymanager',
	'text!templates/customizer-form.html',
	'ractiveTapEvent'
	], function(_, $, lodash, vent, Ractive, Lobby, customizerTpl) {
	var Customizer = function() {

		function getRandomName(female) {
			var maleNames = ['Anakin Skywalker','Atton Rand','Bao-Dur','Boba Fett','Canderous Ordo','Carth Onasi','Chewbacca','Chuundar','Dooku','Malak','Nihilus','Sion','Han Solo','Hanharr','Jolee Bindo','Kit Fisto','Kyle Katarn','Luke Skywalker','Mace Windu','Mical','Obi-Wan Kenobi','Palpatine','Plo Koon','Starkiller','Yoda','Zaalbar'],
				femaleNames = ['Aayla Secura','Ahsoka Tano','Asajj Ventress','Bastila Shan','Brianna','Jan Ors','Juhani','Kreia','Leia Organa','Luminara Unduli','Mara Jade','Mira','Mission Vao','Mon Mothma','Visas Marr'],
				prefix = ["Darth", "Count", "Commander", "Lord", "Emperor", "Duke"],
				names = female ? femaleNames : maleNames,
				random_name = names[_.random(names.length-1)],
				random_prefix = prefix[_.random(prefix.length-1)],
				random_long_name = random_prefix + ' ' + random_name;

			return random_long_name.length > 12 ? random_name : random_long_name;
		}

		function getRandomAccount() {
			var account = {},
				data = pc.device.loader.get('items').resource.data;

			account.gender = _.shuffle(['male', 'female']).pop();
			account.username = getRandomName(account.gender === 'female');
			account.slots = {};

			_.each(data.slots, function(name, slotid) {
				var candidates = [];
				_.each(data.items, function(item, itemid) {
					if(item.slot == slotid) {
						if(item.variants && !_.isEmpty(item.variants)) {
							candidates.push([
								itemid,
								_.shuffle(_.keys(item.variants)).pop()
							]);
						} else {
							candidates.push(itemid);
						}
					}
				});
				account.slots[slotid] = _.shuffle(candidates).pop();
			});

			return account;
		}

		function getSlots(slotData) {
			var slots = {};
			_.each(slotData, function(val, key) {
				if(val.selectedVariant) {
					slots[key] = [val.selectedItem, val.selectedVariant];
				} else {
					slots[key] = val.selectedItem;
				}
			});
			return slots;
		}

		function getCost(slotData) {
			var slots = getSlots(slotData),
				data = pc.device.loader.get('items').resource.data,
				cost = 0;

			_.each(slots, function(item, slot) {
				if(slot>=10 && _.has(data.items, item)) {
					cost += data.items[item].price;
				}
			});

			return cost;
		}

		this.init = function() {
			var that = this,
				data = pc.device.loader.get('items').resource.data,
				$customiser = $('.overlay-customiser'),
				slotData = {},
				localAccount = localStorage.getObject('account'),
				ractive;

			if(!localAccount) {
				localAccount = getRandomAccount();
			}

			_.each(data.slots, function(slot, slotid) {
				slotData[slotid] = {
					'name': slot.name,
					'id': slotid,
				};
				if(localAccount.slots[slotid] && _.isArray(localAccount.slots[slotid])) {
					slotData[slotid]['selectedItem'] = localAccount.slots[slotid][0];
					slotData[slotid]['selectedVariant'] = localAccount.slots[slotid][1];
				} else if(localAccount.slots[slotid]) {
					slotData[slotid]['selectedItem'] = localAccount.slots[slotid];
				}
			});

			ractive = new Ractive({
				el: $customiser[0],
				template: customizerTpl,
				data: {
					data: data,
					slotData: slotData,
					username: localAccount.username,
					gender: localAccount.gender,
					activeScreen: 'character',
					playermeta: {},
					preview: false,
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
					currentcost: getCost(slotData),
					isEmpty: _.isEmpty
				}
			});

			ractive.observe('slotData', function(newValue) {
				var account = {};
				
				account.username = ractive.get('username');
				account.gender = ractive.get('gender');
				account.slots = getSlots(newValue);

				vent.trigger('customize:change', account);
			});

			ractive.observe('gender', function(newValue) {
				var account = {};
				
				account.username = ractive.get('username');
				account.gender = newValue;
				account.slots = getSlots(ractive.get('slotData'));

				vent.trigger('customize:change', account);
			});

			ractive.on('select', function(event) {
				var slot = event.node.getAttribute('data-slot'),
					id = event.node.getAttribute('data-id'),
					currentcost;

				if(slot == 'gender') {
					ractive.set('gender', id);
				} else {
					ractive.set(['slotData', slot, 'selectedItem'].join('.'), id);
				}

				currentcost = getCost(ractive.get("slotData"));

				ractive.set('currentcost', currentcost);
				ractive.set('openedSlot', null);
			});

			ractive.on('hint', function(event) {
				var slot = event.node.getAttribute('data-slot'),
					id = event.node.getAttribute('data-id');

				if(slot == 'gender') {
					ractive.set('hint', data.genders[id]);
				} else if(slot && id || slot && id === "") {
					if(id == "") {
						ractive.set('hint', "No " + data.slots[slot].name);
					} else {
						ractive.set('hint', data.items[id]);
					}
				} else {
					//@TODO: define descriptions in items.json?
					ractive.set("hint", "Press to select equipment");
				}
			});

			ractive.on('openSlot',function(event) {
				ractive.set('openedSlot', event.node.getAttribute('data-slot'));
			});

			ractive.on('closeSlots', function(event) {
				if(event.original.originalTarget.getAttribute('data-slot')) {
					return;
				}
				ractive.set('openedSlot', null);
				
			});

			ractive.on('clearPreview', function(event) {
				if(event.original.originalTarget.classList.contains('action-preview')) {
					return;
				}
				ractive.set('preview', false);
			});

			ractive.on('clearHint', function(event) {
				ractive.set('hint', '');
			});

			ractive.on('update', function() {
				var account = {};

				account.username = ractive.get('username');
				account.gender = ractive.get('gender');
				account.slots = getSlots(ractive.get("slotData"));

				localStorage.setObject('account', account);
				vent.trigger('customize:end', account);
			});

			// mobile only, switch screen (view)
			ractive.on('switchScreen', function(event) {
				var scr = event.node.getAttribute('data-target-screen');
				ractive.set('activeScreen', scr);
			});

			// mobile only show character preview
			ractive.on('preview', function(event) {
				ractive.set('preview', true);
			});

			vent.on('customize', function() {
				var account = {};
				
				account.username = ractive.get('username');
				account.gender = ractive.get('gender');
				account.slots = getSlots(ractive.get("slotData"));

				vent.trigger('customize:change', account);
				$customiser.show();
			});

			vent.on('customize:end', function(items) {
				$customiser.hide();
			});

			vent.on('welcome', function() {
				ractive.set('playermeta', Lobby.metacollector[Lobby.player_id]);
			});

			vent.on('meta', function() {
				ractive.set('playermeta', Lobby.metacollector[Lobby.player_id]);
			});
		};
	};

	return new Customizer();
});