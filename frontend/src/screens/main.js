define(['MelonJS', 'entities/archer'], function(me, Archer) {
	var MainScreen = me.ScreenObject.extend({
		onResetEvent: function() {	
			this.entityLookup = {};
			me.levelDirector.loadLevel("map");
			me.event.subscribe('/entity/update', _.bind(this.onEntityUpdated, this));
			// me.event.subscribe('/entity/frame', _.bind(this.onFrame, this));
			// me.event.subscribe('/entity/remove', _.bind(this.onEntityRemoved, this));
/*			var player = me.entityPool.newInstanceOf("archer");
			me.game.add(player);*/
			// var player = me.entityPool.newInstanceOf("archer");
			// me.game.add(player);
			// var player = me.entityPool.newInstanceOf("archer");
			// me.game.add(player);
				// this.player = me.entityPool.newInstanceOf("archer");
				// me.game.add(this.player);
			
		},

		onEntityUpdated: function(entity) {
			if(entity.entityType == 'player') {
				this.player = me.entityPool.newInstanceOf("archer");
				me.game.add(this.player);
			}
			// console.log('a');
			// this.player.translate(10, 10);
			// this.player.renderable.update();
						
			// 	var player = me.entityPool.newInstanceOf("archer");
			// 	me.game.add(player);
			// 	// this.entityLookup[entity.id] = player;
			// }
		},

		// onEntityRemoved: function(entity) {
		// 	var gameEntity = this.entityLookup[entity.id];
		// 	if(gameEntity) {
				// me.game.remove(gameEntity);
		// 	}
		// },

		// onFrame: function(entity) {
		// 	var gameEntity = this.entityLookup[entity.id];
		// 	if(gameEntity) {
		// 		gameEntity.pos.x = entity.x;
		// 		gameEntity.pos.y = entity.y;
		// 	}
		// },

		onDestroyEvent: function() {
		},

		update: function() {
			this.parent();
			return true;
		}
		
	});

	return MainScreen;
});