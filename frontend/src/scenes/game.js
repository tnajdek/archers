define(['pc', 'vent', 'entityfactory'], function(pc, vent, EntityFactory) {
	var GameScene = pc.Scene.extend('pc.archers.GameScene', {}, {
		entities: {},
		init:function () {
			var that = this,
				layer, layerOrder, layerNode;
			this._super();
			this.factory = new EntityFactory();
			this.physics = new pc.systems.Physics({
				gravity:{ x:0, y:0 },
				debug: true
			});

			this.loadFromTMX(pc.device.loader.get('map').resource, this.factory);

			//order layers based on the name
			layerNode = this.layers.first;
			while (layerNode) {
				layer = layerNode.object();
				layerOrder = layer.name.match(/\d+/);
				if(layerOrder && layerOrder.length) {
					layer.setZIndex(parseInt(layerOrder[0], 10));
				}
				layerNode = layerNode.next();
			}

			this.layer = this.get('500main');
			this.layer.addSystem(this.physics);
			this.layer.addSystem(new pc.systems.Render());


			vent.on('update', function(msg) {
				var shape = pc.Point.create(msg.width, msg.height),
					properties = {
						id: msg.id,
						state: msg.state
					};

				that.entities[msg.id] = that.factory.createEntity(that.layer, msg.entityType, msg.x, msg.y, msg.direction, shape, properties);
			});

			vent.on('frame', function(msg) {
				var entity = that.entities[msg.id],
					spatial = entity.getComponent('spatial'),
					state = entity.getComponent('state'),
					sprite = entity.getComponent('sprite');

				if(spatial) {
					spatial.getPos().x = msg.x;
					spatial.getPos().y = msg.y;
				}

				if(state && sprite) {
					state.changeState(sprite, msg.state, msg.direction);
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