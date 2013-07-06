define(['lodash', 'pc', 'vent'], function(_, pc, vent) {
	return pc.systems.Input.extend('PlayerControlSystem', {}, {
		process: function (entity) {
			var direction, attacking,
				input = entity.getComponent('input'),
				currentInput;
			this._super(entity);

			// console.log('aaaa', lastInputSent);

			if (this.isInputState(entity, 'moving up')) {
				direction = 'N';
			} else if (this.isInputState(entity, 'moving down')) {
				direction = 'S';
			} else if (this.isInputState(entity, 'moving right')) {
				direction = 'E';
			} else if (this.isInputState(entity, 'moving left')) {
				direction = 'W';
			}

			attacking = this.isInputState(entity, 'attacking');

			if(attacking) {
				currentInput =  ['attack', direction || input.lastDirection  || "S"];
			} else if(direction) {
				currentInput = ['move', direction || input.lastDirection || "S"];
			} else if(input) {
				currentInput = ['stop'];
			}

			if(currentInput[0] !== input.lastAction || currentInput[1] !== input.lastDirection) {
				input.lastAction = currentInput[0];
				input.lastDirection = currentInput[1] || input.lastDirection;
				vent.trigger('input', currentInput[0], currentInput[1]);
			}
		}
	});
});