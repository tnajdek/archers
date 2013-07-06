define(['lodash', 'vent', 'messaging', 'messaging/useraction'],
	function(_, vent, Messaging, UserActionMessage) {
	return function() {
		var that = this;
		this.ws = new WebSocket("ws://localhost:9000");
		this.ws.binaryType = 'arraybuffer';

		this.oninput = function(action, direction) {
			var msg = new UserActionMessage({
				action: action,
				direction: direction
			});
			that.ws.send(Messaging.toBuffer([msg]));
		};

		this.onspawn = function(e) {
			var msg = new UserActionMessage({
				action: 'spawn',
				direction: 'S'
			});
			// console.log(msg.toBuffer());
			that.ws.send(Messaging.toBuffer([msg]));
		};

		this.onmessage = function(e) {
			messages = Messaging.fromBuffer(e.data);
			if(messages[0].schema.id === 2) {
				messages.forEach(function(msg) {
					vent.trigger('update', msg);
				});
			}
			if(messages[0].schema.id === 1) {
				messages.forEach(function(msg) {
					vent.trigger('frame', msg);
				});
			}
			if(messages[0].schema.id === 4) {
				messages.forEach(function(msg) {
					vent.trigger('remove', msg);
				});
			}
		};

		this.ws.onopen = function() {
			that.ws.onmessage = that.onmessage;
			vent.on('spawn', that.onspawn);
			vent.on('input', that.oninput)
		};
	};
});