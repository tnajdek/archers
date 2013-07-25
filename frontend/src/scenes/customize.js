define(['pc', 'vent', 'entityfactory'],
	function(pc, vent, EntityFactory) {
	var CustomisationScene = pc.Scene.extend('pc.archers.CustomisationScene', {}, {
		init: function() {
			this._super();

			this.factory = new EntityFactory();
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
			// debugger;
		},

		onDeactivated: function() {
			this.character.remove();
			this.character = null;
		},

		process: function() {
			pc.device.ctx.clearRect(0, 0, pc.device.canvasWidth, pc.device.canvasHeight);
			this._super();

		}
	});

	return CustomisationScene;
});