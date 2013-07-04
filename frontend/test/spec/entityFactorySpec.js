define(['test/chai', 'pc', 'lodash', 'entityfactory', 'messaging/mixins/direction', 'messaging/mixins/state', 'archers'],
	function(chai, pc, _, EntityFactory, directionMixin, stateMixin, Archers) {
		// @TODO: figure out how to test Playcraft-based stuff
		// to much hassle with mocking Playcraft... :/

		// var ef = new EntityFactory(),
		// 	el = new pc.EntityLayer('my entity layer', 1000, 1000),
		// 	directions = _.invert(directionMixin.directionLookup),
		// 	states = _.invert(stateMixin.stateLookup);

		// var canvas = document.createElement('canvas');
		// canvas.setAttribute('id', 'game');
		// document.body.appendChild(canvas);
		// window.Archers = Archers;
		// pc.device.boot('game', 'Archers');*/


/*		describe("EntityFactory", function() {
			it("should create Archer entities", function() {
				var shape = pc.Point.create(64, 64),
					props = { state: states['standing'] },
					archer = ef.createEntity(el, 'archer', 5, 10, directions['N'], shape, props);

				console.log(archer.getComponent('spatial'))
			});
		});*/
});