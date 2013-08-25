define(['lodash', 'pc', 'vent', 'entityfactory', 'spritedef/archer'],
	function(_, pc, vent, EntityFactory, archerSpritedef) {
	var CustomisationScene = pc.Scene.extend('pc.archers.CustomisationScene', {}, {
		init: function() {
			this._super();

			this.factory = new EntityFactory();
			this.loadFromTMX(
				pc.device.loader.get('customizer').resource,
				this.factory
			);
			this.layer = new pc.EntityLayer('main', 500, 500);
			this.addLayer(this.layer);
			this.layer.addSystem(new pc.systems.Render());
		},

		onActivated: function() {
			this.character = this.factory.createEntity(
				this.layer,
				'archer',
				100,
				100,
				'S',
				pc.Point.create(64, 64),
				{
					id: 1,
					state: 'walking',
					player: false
				},
				{}
			);
			vent.on('customize:change', _.bind(this.updateSprite, this));
			// debugger;
		},

		onDeactivated: function() {
			this.character.remove();
			this.character = null;
			vent.off('customize:change');
		},

		updateSprite: function(selected) {
			var newsprite = this.factory.getDynamicSprite(selected, archerSpritedef),
				state = this.character.getComponent('state');
			this.character.removeComponentByType('sprite');
			this.character.addComponent(newsprite);
			state.changeState(newsprite, 'walking', 'S', true);
		},

		process: function() {
			pc.device.ctx.clearRect(0, 0, pc.device.canvasWidth, pc.device.canvasHeight);
			this._super();

		}
	});

	return CustomisationScene;
});