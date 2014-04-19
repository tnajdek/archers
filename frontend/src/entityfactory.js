define(['pc',
	'lodash',
	'spritedef/archer',
	'spritedef/arrow',
	'spritedef/skeleton',
	'spritedef/coin',
	'components/state',
	'components/meta',
	'components/network',
	'composite-image',
	'filtered-image',
	'lobbymanager'
	],
	function(pc, _, archerSpritedef, arrowSpritedef, skeletonSpritedef, coinSpritedef, stateComponent, metaComponent, networkComponent, CompositeImage, FilteredImage, lobbyManager) {
	var EntityFactory = pc.EntityFactory.extend('pc.archers.EntityFactory', {}, {

		getDynamicSprite: function(account, spriteDef, animationState) {
			var data = pc.device.loader.get('items').resource.data,
				layers = [],
				gender = account.gender,
				slots = account.slots,
				keys = _.keys(slots).sort(),
				image, ss;


			_.each(keys, function(key) {
				var selectedItem = slots[key],
					ssSpec, selectedVariant, layerImage;


				if(key == 1 && slots[11]) {
					// hair and helmet selected, don't render hair
					return;
				}

				if(_.isArray(selectedItem)) {
					selectedVariant = selectedItem[1];
					selectedItem = selectedItem[0];
				}

				if(selectedItem && data.items[selectedItem].spritesheet) {
					ssSpec = data.items[selectedItem].spritesheet;

					if(_.isObject(ssSpec) && ssSpec[gender]) {
						ssSpec = ssSpec[gender];
					}
					if(selectedVariant) {
						layerImage = new FilteredImage("", ssSpec, data.items[selectedItem].variants[selectedVariant].filters);
					}

					if(layerImage) {
						layers.push(layerImage);
					} else {
						layers = layers.concat(ssSpec);
					}
				}
			});


			image = new CompositeImage("", layers);
			ss = new pc.SpriteSheet({
				image: image,
				frameWidth: spriteDef.frameWidth,
				frameHeight: spriteDef.frameHeight
			});

			// TODO: deduplicate common code with getSprite
			animationState = animationState || spriteDef.frameDefault;
			_.each(spriteDef.frames, function(a) {
				ss.addAnimation(a);
			});



			return pc.components.Sprite.create({
				spriteSheet:ss,
				animationStart: animationState
			});
		},

		updateArcherSprite: function(entity, account) {
			var state = entity.getComponent('state'),
				data = pc.device.loader.get('items').resource.data,
				attackSpeed = 1.0,
				spriteDef = JSON.parse(JSON.stringify(archerSpritedef)), //clone deep
				newsprite;

			_.forEach(account.slots, function (itemId, slotId) {
				if(_.isArray(itemId)) {
					itemId = itemId[0];
				}

				if(data.items[itemId] && data.items[itemId].properties && data.items[itemId].properties.speed) {
					attackSpeed = attackSpeed * data.items[itemId].properties.speed;
				}
			});

			if(entity.hasComponentOfType('sprite')) {
				entity.removeComponentByType('sprite');
			}

			_.each(spriteDef.frames, function(frame, key) {
				if(frame.name.indexOf("shooting") === 0) {
					spriteDef.frames[key].time = attackSpeed * spriteDef.frames[key].time;
				}

			});

			newsprite = this.getDynamicSprite(account, spriteDef, state.getStatedir());
			entity.addComponent(newsprite);
		},

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
				x:x-0.5*width,
				y:y-0.5*height,
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

		makeCollidable: function(layer, x, y, dir, shape, props) {
			var spatial = this.getSpatial(x, y, shape.x, shape.y),
				entity = pc.Entity.create(layer);

			entity.addComponent(spatial);
			return entity;
		},

		makeArcher: function(layer, x, y, dir, shape, props) {
			var state = stateComponent.create(props.state, dir),
				meta = metaComponent.create(),
				entity = pc.Entity.create(layer),
				network = networkComponent.create(),
				spatial = this.getSpatial(x, y, 64, 64),
				metadata = lobbyManager.metacollector[props.id],
				sprite;

			if(metadata && !_.isEmpty(metadata.slots)) {
				sprite = this.getDynamicSprite(metadata, archerSpritedef, state.getStatedir());
				// 
			} else {
				//@TODO: nulify
				sprite = this.getSprite(archerSpritedef, state.getStatedir());
				//ghost/observer/whatever - no avatar
				// spatial = this.getSpatial(0, 0, 64, 64);
			}

			entity.addComponent(state);
			entity.addComponent(meta);
			entity.addComponent(spatial);
			if(sprite) {
				entity.addComponent(sprite);
			}
			entity.addComponent(network);

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
				entity = pc.Entity.create(layer),
				network = networkComponent.create();


			entity.addComponent(state);
			entity.addComponent(meta);
			entity.addComponent(spatial);
			entity.addComponent(sprite);
			entity.addComponent(network);

			return entity;
		},

		makeArrow: function(layer, x, y, dir, shape, props) {
			var spatial = this.getSpatial(x, y, 32, 32),
				state = stateComponent.create(props.state, dir),
				sprite = this.getSprite(arrowSpritedef, state.getStatedir()),
				entity = pc.Entity.create(layer),
				network = networkComponent.create();

			entity.addComponent(spatial);
			entity.addComponent(sprite);
			entity.addComponent(network);

			return entity;
		},

		makeCoin: function(layer, x, y, dir, shape, props, color) {
			
			var spatial = this.getSpatial(x, y, 32, 32),
				state = stateComponent.create(props.state, dir),
				entity = pc.Entity.create(layer),
				spriteDef = _.clone(coinSpritedef),
				sprite;


		spriteDef.spriteName = color;

		sprite = this.getSprite(spriteDef, state.getStatedir());

		entity.addComponent(spatial);
		entity.addComponent(sprite);

		return entity;

		},

		makeGoldCoin: function() {
			return this.makeCoin.apply(this, _.toArray(arguments).concat('pickup.coin.gold'));
		},

		makeSilverCoin: function() {
			return this.makeCoin.apply(this, _.toArray(arguments).concat('pickup.coin.silver'));
		},

		makeCopperCoin: function() {
			return this.makeCoin.apply(this, _.toArray(arguments).concat('pickup.coin.copper'));
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
