define(['lodash', 'vent', 'messaging'], function(_, vent, Messaging) {
	return function() {
		var that = this;
		this.ws = new WebSocket("ws://localhost:9000");
		this.ws.binaryType = 'arraybuffer';

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
		};

		this.ws.onopen = function() {
			that.ws.onmessage = that.onmessage;
		};
	};
});