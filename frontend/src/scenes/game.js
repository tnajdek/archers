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
				var shape = pc.Point.create(msg.width, msg.height),
					properties = {
						id: msg.id,
						state: msg.state
					}

				that.entities[msg.id] = that.factory.createEntity(that.layer, msg.entityType, msg.x, msg.y, msg.direction, shape, properties);
			});

			vent.on('frame', function(msg) {
				var entity = that.entities[msg.id],
					spatial = entity.getComponent('spatial'),
					sprite = entity.getComponent('sprite'),
					state;

				if(spatial) {
					spatial.getPos().x = msg.x
					spatial.getPos().y = msg.y
				}

				if(sprite) {
					sprite = sprite.sprite;
					state = msg.state + ' ' + msg.direction
					if(sprite.spriteSheet.animations.containsKey(state)) {
						sprite.setAnimation(state);
					} else {
						state = msg.state;
						if(sprite.spriteSheet.animations.containsKey(state)) {
							sprite.setAnimation(state);
						}
					}
				}
			});

			vent.on('remove', function(msg) {
				var entity = that.entities[msg.id];
				entity.remove();
			});
		}
	});
	return GameScene;
});