define(['lodash', 'pc', 'vent', 'entityfactory', 'systems/render', 'systems/playercontrol', 'systems/network', 'lobbymanager'],
	function(_, pc, vent, EntityFactory, RenderSystem, PlayerControlSystem, NetworkSystem, lobbyManager) {
	var GameScene = pc.Scene.extend('pc.archers.GameScene', {}, {
		entities: {},
		cameraOperationLag:0,

		init:function () {
			var that = this,
				layer, layerOrder, layerNode;
			this._super();

			this.factory = new EntityFactory();
			this.playercontrol = new PlayerControlSystem();
			this.loadFromTMX(pc.device.loader.get('map').resource, this.factory);
			this.layer = this.get('500main');

			//order layers based on the name
			layerNode = this.layers.first;
			while (layerNode) {
				layer = layerNode.object();
				layerOrder = layer.name.match(/\d+/);
				if(layerOrder && layerOrder.length) {
					layer.setZIndex(parseInt(layerOrder[0], 10));
				}
				layer.setOriginTrack(this.layer);
				layerNode = layerNode.next();
			}

			this.layer.addSystem(new RenderSystem());
			this.layer.addSystem(new NetworkSystem());
			this.layer.addSystem(new pc.systems.Expiration());
			this.layer.addSystem(this.playercontrol);


			vent.on('update', function(msg) {
				var shape, meta, entity;

				console.log(msg);

				if(!that.isActive()) {
					return;
				}

				shape = pc.Point.create(msg.width, msg.height),
					properties = {
						id: msg.id,
						state: msg.state,
						player: msg.player
					}

				// @TODO: ADD META to render unique characers
				entity = that.entities[msg.id] = that.factory.createEntity(
					that.layer,
					msg.entityType,
					msg.x,
					msg.y,
					msg.direction,
					shape,
					properties
				);


				if(entity) {
					meta = entity.getComponent('meta');
					if(meta && lobbyManager && lobbyManager.metacollector[msg.id]) {
						meta.update(lobbyManager.metacollector[msg.id]);
					}
				}
			});

			vent.on('frame', function(msg) {
				if(!that.isActive()) {
					return;
				}
				var entity = that.entities[msg.id],
					// spatial = entity.getComponent('spatial'),
					state = entity.getComponent('state'),
					sprite = entity.getComponent('sprite'),
					network = entity.getComponent('network'),
					badStates = ['dead', 'unknown'];

				if(network) {
					network.update(msg)
					// debugger;
					// spatial.getCenterPos().x = msg.x;
					// spatial.getCenterPos().y = msg.y;
				}

				if(state && sprite) {
					if(entity.hasTag('PLAYER') && !_.contains(badStates, state.state) && _.contains(badStates, msg.state)) {
						vent.trigger('player-has-died');
						that.player.getComponent('input')._bound = false;
						that.player.removeComponentByType('input');
					}

					if(entity.hasTag('PLAYER') && msg.state == "unknown") {
						vent.trigger('player-can-spawn');
					}

					if(entity.hasTag('PLAYER') && _.contains(badStates, state.state) && !_.contains(badStates, msg.state)) {
						vent.trigger('player-has-spawned');
						that.player.addComponent(that.factory.getInput());
					}
					state.changeState(sprite, msg.state, msg.direction);
				}
			});

			vent.on('remove', function(msg) {
				if(!that.isActive()) {
					return;
				}
				var entity = that.entities[msg.id];
				if(entity) {
					entity.remove();
				}
			});	

			vent.on('meta', function(msg) {
				var entity = that.entities[msg.id],
					meta;

				// @TODO: UPDATE ENTITY META render unique characers
				if(entity) {
					meta = entity.getComponent('meta');
					if(meta) {
						meta.update(msg);
					}
					// @TODO: test if changed
					that.factory.updateArcherSprite(entity, msg);
				}
			});

			vent.on("event", function(msg) {
				that.factory.createEntity(
					that.layer,
					'deflectEvent',
					msg.x,
					msg.y
				);
			});
		},

		onActivated: function() {
			lobbyManager.show();
		},

		onDeactivated: function() {
			lobbyManager.hide(true);
		},

		hoverCamera:function() {
			var terrainlayer = this.layers.first.object(),
				width = terrainlayer.tileMap.tileWidth * terrainlayer.tileMap.tilesWide,
				height = terrainlayer.tileMap.tileHeight * terrainlayer.tileMap.tilesHigh,
				getRandomInt = function(min, max) {
					return Math.floor(Math.random() * (max - min + 1)) + min;
				},
				newX, horizontalMax, verticalMax, horizontalMin, verticalMin;

			if(this.viewPort.w >= width || this.viewPort.h >= height) {
				//don't bother
				return;
			}
			this.cameraOperationLag++;

			if(this.cameraOperationLag == 4) {
				newX = this.layer.origin.x+1;
				this.cameraOperationLag=0;
			} else {
				newX = this.layer.origin.x;
			}

			horizontalMax = newX + this.viewPort.w;
			verticalMax = this.layer.origin.y + this.viewPort.h;
			// horizontalMin = newX - this.viewPort.w;
			// verticalMin = this.layer.origin.y - this.viewPort.h;

			if(horizontalMax > width || verticalMax > height) {
				this.layer.setOrigin(
					getRandomInt(1, width-this.viewPort.w),
					getRandomInt(1, width-this.viewPort.h)
				);
			} else {
				// smoooth
				this.layer.setOrigin(
					newX,
					this.layer.origin.y
				);
			}
		},

		process:function () {
			var player, state;

			if (!pc.device.loader.finished) {
				return;
			}
			
			player = this.layer.entityManager.getTagged('PLAYER');
			
			if(player) {
				this.player = player = player.first.object();
				state = player.getComponent('state');
			}

			if (player && state.isAlive()) {
				this.layer.setOrigin(
					player.getComponent('spatial').getCenterPos().x - (this.viewPort.w / 2),
					player.getComponent('spatial').getCenterPos().y - (this.viewPort.h / 2)
				);
			} else {
				this.hoverCamera();
			}

			// clear the background
			pc.device.ctx.clearRect(0, 0, pc.device.canvasWidth, pc.device.canvasHeight);

			// always call the super
			this._super();
		}
	});
	return GameScene;
});