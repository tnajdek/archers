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
				strokeStyle: 'orange'
			});

			this.joystickL.addEventListener('touchStartValidation', function(event){
				var touch	= event.changedTouches[0];
				if( touch.pageX < window.innerWidth/2 )	return false;
				return true;
			});


			this._super();
		},

		process: function (entity) {
			var direction, attacking,
				input = entity.getComponent('input'),
				state = entity.getComponent('state'),
				currentInput;

			if(!input) {
				// TODO: this is too brute force
				pc.device.input.stateBindings.clear();
				return;
			}

			this._super(entity);
			if(!state.isAlive()) {
				return;
			}

			// console.log('aaaa', lastInputSent);

			if (this.isInputState(entity, 'moving up') || this.joystickR.up()) {
				direction = 'N';
			} else if (this.isInputState(entity, 'moving down') || this.joystickR.down()) {
				direction = 'S';
			} else if (this.isInputState(entity, 'moving right') || this.joystickR.right()) {
				direction = 'E';
			} else if (this.isInputState(entity, 'moving left') || this.joystickR.left()) {
				direction = 'W';
			}

			attacking = this.isInputState(entity, 'attacking');

			if(!attacking) {
				if(this.joystickL.up()) {
					direction = 'N';
					attacking = true;
				} else if(this.joystickL.down()) {
					direction = 'S';
					attacking = true;
				} else if(this.joystickL.right()) {
					direction = 'E';
					attacking = true;
				} else if(this.joystickL.left()) {
					direction = 'W';
					attacking = true;
				}
			}

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