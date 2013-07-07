define(['lodash', 'pc', 'vent', 'entityfactory', 'systems/playercontrol', 'systems/meta', 'lobbymanager'],
	function(_, pc, vent, EntityFactory, PlayerControlSystem, MetaSystem, lobbyManager) {
	var GameScene = pc.Scene.extend('pc.archers.GameScene', {}, {
		entities: {},
		cameraOperationLag:0,

		init:function () {
			var that = this,
				layer, layerOrder, layerNode;
			this._super();

			this.factory = new EntityFactory();
			// this.physics = new pc.systems.Physics({
			// 	gravity:{ x:0, y:0 },
			// 	debug: false
			// });

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

			// this.layer.addSystem(this.physics);
			this.layer.addSystem(new pc.systems.Render());
			this.layer.addSystem(new PlayerControlSystem());
			this.layer.addSystem(new MetaSystem());


			vent.on('update', function(msg) {
				if(!that.isActive()) {
					return;
				}

				var shape = pc.Point.create(msg.width, msg.height),
					properties = {
						id: msg.id,
						state: msg.state,
						player: msg.player
					};

				that.entities[msg.id] = that.factory.createEntity(
					that.layer,
					msg.entityType,
					msg.x,
					msg.y,
					msg.direction,
					shape,
					properties
				);
			});

			vent.on('frame', function(msg) {
				if(!that.isActive()) {
					return;
				}
				var entity = that.entities[msg.id],
					spatial = entity.getComponent('spatial'),
					state = entity.getComponent('state'),
					sprite = entity.getComponent('sprite'),
					badStates = ['dead', 'unknown'];

				if(spatial) {
					spatial.getPos().x = msg.x-0.5*spatial.getDim().x;
					spatial.getPos().y = msg.y-0.5*spatial.getDim().y;
					// debugger;
					// spatial.getCenterPos().x = msg.x;
					// spatial.getCenterPos().y = msg.y;

				}


				if(state && sprite) {
					if(entity.hasTag('PLAYER') && !_.contains(badStates, state.state) && _.contains(badStates, msg.state)) {
						lobbyManager.show();
					}

					if(entity.hasTag('PLAYER') && _.contains(badStates, state.state) && !_.contains(badStates, msg.state)) {
						lobbyManager.hide();
					}
					state.changeState(sprite, msg.state, msg.direction);
				}
			});

			vent.on('remove', function(msg) {
				if(!that.isActive()) {
					return;
				}
				var entity = that.entities[msg.id];
				entity.remove();
			});	

			vent.on('meta', function(msg) {
				var entity = that.entities[msg.id],
					meta;

				if(entity) {
					meta = entity.getComponent('meta');
					if(meta) {
						meta.update(msg);
					}					
				}
			})
		},

		onActivated: function() {
			lobbyManager.show();
		},

		onDeactivated: function() {
			lobbyManager.hide();
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
				player = player.first.object();
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