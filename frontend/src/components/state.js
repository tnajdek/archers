define(['pc'], function(pc) {
	return pc.components.Component('State', {
		create: function (state, direction) {
			var n = this._super();
			n.config(state, direction);
			return n;
		}
	}, {
		state: 'unknown',
		direction: 'S',

		init: function () {
			this._super(this.Class.shortName);
			this.config();
		},

		config: function (state, direction) {
			this.state = state || 'unknown';
			this.direction = direction || 'S';
		},

		getStatedir: function() {
			if(this.state === 'unknown') {
				return this.state;
			}
			return this.state + ' ' + this.direction;
		},


		isAlive: function() {
			if(this.state === 'dead' || this.state === 'unknown') {
				return false;
			}
			return true;
		},

		changeState:function (sprite, physics, newState, newDirection, force) {
			var statedir;
			if (this.state === newState && this.direction === newDirection && !force) {
				return false;
			}

			this.state = newState;
			this.direction = newDirection;
			statedir = this.getStatedir();

			if(physics && newState == 'walking' && newDirection) {
				// why force of 3 is equal of force of 6 on the srv?
				physics.setLinearVelocity(0,0);
				if(newDirection == 'E') {
					physics.applyImpulse(3, 0);
				}
				else if(newDirection == 'W') {
					physics.applyImpulse(3, 180);
				}
				else if(newDirection == 'S') {
					physics.applyImpulse(3, 90);
				}
				else if(newDirection == 'N') {
					physics.applyImpulse(3, 270);
				}
			} else if(physics && newState != 'walking') {
				physics.setLinearVelocity(0,0);
			}

			if(sprite.sprite.spriteSheet.animations.containsKey(statedir)) {
				sprite.sprite.setAnimation(statedir);
			} else if(sprite.sprite.spriteSheet.animations.containsKey(this.state)) {
				sprite.sprite.setAnimation(this.state);
			} else {
				throw "Couldn't find animation for " + statedir;
			}
			return true;
		}
	});
});