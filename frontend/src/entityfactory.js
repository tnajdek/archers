define(['pc', 'lodash', 'spritedef/archer', 'spritedef/arrow', 'components/state'],
	function(pc, _, archerSpritedef, arrowSpritedef, stateComponent) {
	var EntityFactory = pc.EntityFactory.extend('pc.archers.EntityFactory', {}, {

		// animationState to be automated based on state and dir
		getSprite: function(spriteDef, animationState) {
			var spriteImage = pc.device.loader.get(spriteDef.spriteName).resource,
				ss = new pc.SpriteSheet({
					image: spriteImage,
					frameWidth: spriteDef.frameWidth,
					frameHeight: spriteDef.frameHeight
				});

			animationState = animationState || spriteDef.frameDefault;

			_.each(spriteDef.frames, function(a) {
				ss.addAnimation(a);
			});

			return pc.components.Sprite.create({
				spriteSheet:ss,
				animationStart: animationState
			});
		},

		getSpatial: function(x, y, width, height) {
			return pc.components.Spatial.create({ 
				x:x,
				y:y,
				w:width,
				h:height 
			});
		},

		getInput: function() {
			return pc.components.Input.create({
					states:[
						['moving right', ['D', 'RIGHT']],
						['moving left', ['A', 'LEFT']],
						['moving up', ['W', 'UP']],
						['moving down', ['S', 'DOWN']],
						['attacking', ['SPACE']],
					]
			});
		},

		makeCollidable: function(layer, x, y, dir, shape, props) {
			var spatial = this.getSpatial(x, y, shape.x, shape.y),
				entity = pc.Entity.create(layer);

			entity.addComponent(spatial);
			return entity;
		},

		makeArcher: function(layer, x, y, dir, shape, props) {
			var spatial = this.getSpatial(x, y, 64, 64),
				state = stateComponent.create(props.state, dir),
				sprite = this.getSprite(archerSpritedef, state.getStatedir()),
				entity = pc.Entity.create(layer);

			entity.addComponent(state);
			entity.addComponent(spatial);
			entity.addComponent(sprite);
			if(props.player) {
				entity.addComponent(this.getInput());
				entity.addTag('PLAYER');
			}

			return entity;
		},

		makeArrow: function(layer, x, y, dir, shape, props) {
			var spatial = this.getSpatial(x, y, 32, 32),
				state = stateComponent.create(props.state, dir),
				sprite = this.getSprite(arrowSpritedef, state.getStatedir()),
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
