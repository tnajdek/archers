define(['jquery', 'lodash', 'pc', 'vent', 'virtualjoystick'],
	function($, _, pc, vent, VirtualJoystick) {
	return pc.systems.Input.extend('PlayerControlSystem', {}, {
		init: function() {

			
			this.joystickR = new VirtualJoystick({
				container: $('#virtualjoystick')[0],
				strokeStyle: 'cyan'
			});

			this.joystickR.addEventListener('touchStartValidation', function(event){
				var touch	= event.changedTouches[0];
				if( touch.pageX >= window.innerWidth/2 )	return false;
				return true;
			});

			this.joystickL = new VirtualJoystick({
				container: $('#virtualjoystick')[0],
				strokeStyle: 'orange',
				limitStickTravel: true,
				stickRadius: 0
			});

			this.joystickL.addEventListener('touchStartValidation', function(event){
				var touch	= event.changedTouches[0];
				if( touch.pageX < window.innerWidth/2 )	return false;
				return true;
			});


			this._super();
		},

		getDirections: function(entity) {
			var directions = [];

			if (this.isInputState(entity, 'moving up') || this.joystickR.up()) {
				directions.push('N')
			}
			if (this.isInputState(entity, 'moving down') || this.joystickR.down()) {
				directions.push('S');
			}
			if (this.isInputState(entity, 'moving right') || this.joystickR.right()) {
				directions.push('E');
			}
			if (this.isInputState(entity, 'moving left') || this.joystickR.left()) {
				directions.push('W');
			}

			return directions;
		},

		getInputPrecedence: function(directions, input) {
			var oldDir, newDir;
			if( directions.indexOf(input.lastDirection) > -1) {
				oldDir = input.lastDirection;
				newDir = _.without(directions, input.lastDirection)[0];
				return [newDir, oldDir]
			} else {
				return directions;
			}
		},

		process: function (entity) {
			var direction, attacking,
				input = entity.getComponent('input'),
				state = entity.getComponent('state'),
				currentInput = [], moveDirections, direction;

			if(!input) {
				// TODO: this is too brute force
				pc.device.input.stateBindings.clear();
				return;
			}

			this._super(entity);
			if(!state.isAlive()) {
				return;
			}

			moveDirections = this.getDirections(entity);

			attacking = this.isInputState(entity, 'attacking');

			if(!attacking) {
				attacking = this.joystickL._pressed;
			}

			if(moveDirections.length > 0) {
				currentInput[0] = 'move';
				
				if(moveDirections.length > 1) {
					moveDirections = this.getInputPrecedence(moveDirections, input);
					input.lastDirection = moveDirections[1];
				} else {
					input.lastDirection = moveDirections[0];
				}

				currentInput[1] = moveDirections[0];
			} else {
				currentInput[0] = 'stop';
				currentInput[1] = input.lastDirection;
			}

			if(attacking) {
				currentInput[0] = 'attack';
				input.postAttackLock = true;
			}

			if(input.lastInputAction == 'attack' && currentInput[0] == 'stop' && input.postAttackLock) {
				// at this point user released the attack key
				// we prettend that the input is and has been in the 'stop' state and don't serve
				// anything to the server. Now server will assume we want to continue with current attack
				// unless a new input comes in which will interrupt ongoing attack
				input.postAttackLock = false;
				input.lastInputState = currentInput.join();
				return;
			}


			if(input.lastInputState !== currentInput.join()) {
				vent.trigger('input', currentInput[0], currentInput[1]);
				input.lastInputState = currentInput.join();
				input.lastInputAction = currentInput[0];
				console.warn('UPDATE', currentInput[0], currentInput[1]);
			}
		}
	});
});