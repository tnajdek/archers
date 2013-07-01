define(['pc', 'lodash', 'animations'], function(pc, _, animations) {
	var EntityFactory = pc.EntityFactory.extend('pc.archers.EntityFactory', {}, {

		// animationState to be automated based on state and dir
		getSprite: function(resourceName, animationState) {
			var spriteImage = pc.device.loader.get(resourceName).resource,
				ss = new pc.SpriteSheet({
					image: spriteImage,
					frameWidth: 64,
					frameHeight: 64
				});

			_.each(animations, function(a) {
				ss.addAnimation(a);
			});

			return pc.components.Sprite.create({
				spriteSheet:ss,
				animationStart: animationState
			});
		},

		getSpatial: function(x, y, width, height) {
			return pc.components.Spatial.create({ x:x, y:y, w:width, h:height });
		},

		makeCollidable: function(layer, x, y, dir, shape, props) {
			var spatial = this.getSpatial(x, y, shape.x, shape.y),
				entity = pc.Entity.create(layer);

			entity.addComponent(spatial);
			return entity;
		},

		makePlayer: function(layer, x, y, dir, shape, props) {
			var spatial = this.getSpatial(x, y, 64, 64),
				sprite = this.getSprite('archer', 'standing S'),
				entity = pc.Entity.create(layer);


			entity.addComponent(spatial);
			entity.addComponent(sprite);

			return entity;
		},

		makeArrow: function(layer, x, y, dir, shape, props) {
			var spatial = this.getSpatial(x, y, 64, 64),
				sprite = this.getSprite('arrow', 'shooting E'),
				entity = pc.Entity.create(layer);

			entity.addComponent(spatial);
			entity.addComponent(sprite);

			return entity;
		},

		createEntity: function(layer, type, x, y, dir, point, properties) {
			var factoryMethod = 'make'+type.charAt(0).toUpperCase()+type.slice(1),
				entity;
			
			if(this[factoryMethod]) {
				entity = this[factoryMethod].call(this, layer, x, y, dir, point, properties);
				entity.addTag(type);
				return entity;
			} else {
				return null;
			}
		}
	});
	return EntityFactory;
});
