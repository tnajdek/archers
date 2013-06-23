define(['lodash', 'MelonJS'], function(_, me) {
	var Archer = me.ObjectEntity.extend({
		init: function() {
			var settings = {
				image: "archer",
				spritewidth: 64,
				spriteheight: 64
			};

			this.z = 100;

			this.parent(0, 0, settings);
			this.setVelocity(0, 0);
			this.z = 100;


			this.renderable.addAnimation('standing N', _.range(13*8, 13*8+1));
			this.renderable.addAnimation('standing W', _.range(13*9, 13*9+1));
			this.renderable.addAnimation('standing S', _.range(13*10, 13*10+1));
			this.renderable.addAnimation('standing E', _.range(13*11, 13*11+1));

			this.renderable.addAnimation('walk N', _.range(13*8, 13*8+9));
			this.renderable.addAnimation('walk W', _.range(13*9, 13*9+9));
			this.renderable.addAnimation('walk S', _.range(13*10, 13*10+9));
			this.renderable.addAnimation('walk E', _.range(13*11, 13*11+9));

			this.renderable.addAnimation('dying', _.range(13*20, 13*20+6));

			this.renderable.addAnimation('shooting N', _.range(13*16, 13*16+13));
			this.renderable.addAnimation('shooting W', _.range(13*17, 13*17+13));
			this.renderable.addAnimation('shooting S', _.range(13*18, 13*18+13));
			this.renderable.addAnimation('shooting E', _.range(13*19, 13*19+13));

			this.renderable.setCurrentAnimation('standing S');

			this.renderable.alwaysUpdate = true;
			me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
			console.log(this);

		},

		update: function() {
			// console.log(this.pos.x++);
			// this.updateMovement();

			// update animation if necessary
			this.parent();
			return true;
		}
	});
	return Archer;
});