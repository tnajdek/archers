define(['pc', 'vent', 'entityfactory'], function(pc, vent, EntityFactory) {
	var GameScene = pc.Scene.extend('pc.archers.GameScene', {}, {
		entities: {},
		init:function () {
			var that = this;
			this._super();
			this.factory = new EntityFactory();
			this.physics = new pc.systems.Physics({
				gravity:{ x:0, y:0 },
				debug: true
			});

			this.loadFromTMX(pc.device.loader.get('map').resource, this.factory);
			this.layer = this.get('main');
			this.layer.addSystem(this.physics);
			this.layer.addSystem(new pc.systems.Render());


			vent.on('update', function(msg) {
				console.log(msg);
				var shape = pc.Point.create(msg.width, msg.height),
					properties = {
						id: msg.id
					}

				that.entities[msg.id] = that.factory.createEntity(that.layer, msg.entityType, msg.x, msg.y, msg.direction, shape, properties);
				console.log('entity', that.entities[msg.id]);
			});

			vent.on('frame', function(msg) {
				var entity = that.entities[msg.id];
				entity.getComponent('spatial').getPos().x = msg.x
				entity.getComponent('spatial').getPos().y = msg.y
			});

			vent.on('remove', function(msg) {
				var entity = that.entities[msg.id];
				entity.remove();
				console.log('remove', entity);
			});
		}
	});
	return GameScene;
});