define(['lodash',
	'jquery',
	'lodash',
	'vent',
	'ractive',
	'text!templates/customizer-form.html'
	], function(_, $, lodash, vent, Ractive, customizerTpl) {
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

		function getSlots(ractive, slotData) {
			var slots = {};
			_.each(ractive.get('slotData'), function(val, key) {
				if(val.selectedVariant) {
					slots[key] = [val.selectedItem, val.selectedVariant];
				} else {
					slots[key] = val.selectedItem;
				}
			});
			return slots;
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

			_.each(data.slots, function(slotname, slotid) {
				slotData[slotid] = {
					'name': slotname,
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
				var account = {};
				
				account.username = ractive.get('username');
				account.gender = ractive.get('gender');
				account.slots = getSlots(ractive, newValue);

				vent.trigger('customize:change', account);
			});

			ractive.observe('gender', function(newValue) {
				var account = {};
				
				account.username = ractive.get('username');
				account.gender = newValue;
				account.slots = getSlots(ractive, slotData);

				vent.trigger('customize:change', account);
			});

			ractive.on('select', function(event) {
				var slot = event.node.getAttribute('data-slot'),
					id = event.node.getAttribute('data-id');

				if(slot == 'gender') {
					ractive.set('gender', id);
				} else {
					ractive.set(['slotData', slot, 'selectedItem'].join('.'), id);
				}
			});

			ractive.on('hint', function(event) {
				var slot = event.node.getAttribute('data-slot'),
					id = event.node.getAttribute('data-id');

				if(event.node.classList.contains('slot')) {
					//@TODO: define descriptions in items.json?
					ractive.set("hint", "Press to select equipment");
				} else if(slot == 'gender') {
					ractive.set('hint', data.genders[id]);
				} else {
					ractive.set('hint', data.items[id].description);
				}

			});

			ractive.on('clearHint', function(event) {
				ractive.set('hint', '');
			});

			ractive.on('update', function() {
				var account = {};

				account.username = ractive.get('username');
				account.gender = ractive.get('gender');
				account.slots = getSlots(ractive, slotData);

				localStorage.setObject('account', account);
				vent.trigger('customize:end', account);
			});

			vent.on('customize', function() {
				var account = {};
				
				account.username = ractive.get('username');
				account.gender = ractive.get('gender');
				account.slots = getSlots(ractive, slotData);

				vent.trigger('customize:change', account);
				$customiser.show();
			});

			vent.on('customize:end', function(items) {
				$customiser.hide();
			});
		};
	};

	return new Customizer();
});