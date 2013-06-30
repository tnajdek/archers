define(['pc'], function() {
	var EntityFactory = pc.EntityFactory.extend('pc.archers.EntityFactory', {}, {

		makeCollidable: function(layer, x, y, dir, shape, props) {
			var physics = pc.components.Physics.create({
				immovable: true
			}),
				spatial =  pc.components.Spatial.create({ x:x, y:y, w:shape.x, h:shape.y }),
				entity = pc.Entity.create(layer);

			entity.addComponent(physics);
			entity.addComponent(spatial);
			return entity;
		},

		createEntity: function(layer, type, x, y, dir, point, properties) {
			var factoryMethod = 'make'+type.charAt(0).toUpperCase()+type.slice(1),
				entity;
			// if(this[factoryMethod]) {
			// 	entity = this[factoryMethod].call(this, layer, x, y, dir, point, properties);
			// 	return entity;
			// }
			entity = this.makeCollidable(layer, x, y, dir, point, properties);
			return entity;
		}
	});
	return EntityFactory;
});
