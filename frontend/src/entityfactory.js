define(['pc', 'lodash', 'spritedef/archer', 'spritedef/arrow', 'spritedef/skeleton', 'components/state', 'components/meta'],
	function(pc, _, archerSpritedef, arrowSpritedef, skeletonSpritedef, stateComponent, metaComponent) {
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
						['attacking', ['SPACE']]
					]
			});
		},

		getPhysics: function() {
			var	properties = {
					shapes: [{
						"type":0,
						"offset": {
								"y":16,
								"x":16,
								"w":-16
							}
						}]
					// maxSpeed:{x:24, y:24},
					// friction:0,
					// fixedRotation:true,
					// bounce:0,
					// mass:1.8
			};			
			return pc.components.Physics.create(properties);
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
				meta = metaComponent.create(),
				sprite = this.getSprite(archerSpritedef, state.getStatedir()),
				entity = pc.Entity.create(layer),
				physics = this.getPhysics();

			entity.addComponent(state);
			entity.addComponent(meta);
			entity.addComponent(spatial);
			entity.addComponent(sprite);
			entity.addComponent(physics);

			if(props.player) {
				entity.addTag('PLAYER');
			}

			return entity;
		},

		makeSkeleton: function(layer, x, y, dir, shape, props) {
			var spatial = this.getSpatial(x, y, 64, 64),
				state = stateComponent.create(props.state, dir),
				meta = metaComponent.create(),
				sprite = this.getSprite(skeletonSpritedef, state.getStatedir()),
				entity = pc.Entity.create(layer);

			entity.addComponent(state);
			entity.addComponent(meta);
			entity.addComponent(spatial);
			entity.addComponent(sprite);

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
