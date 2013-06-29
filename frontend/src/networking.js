define(['lodash', 'messaging'], function(_, me, Messaging) {
	return {
		init: function() {
			var that = this;

			this.ws = new WebSocket("ws://localhost:9000");
			this.ws.binaryType = 'arraybuffer';
			this.ws.onopen = function() {
				that.ws.onmessage = that.onmessage;
			};
		},

		onmessage: function(e) {
			messages = Messaging.fromBuffer(e.data);
			if(messages[0].schema.id === 2) {
				messages.forEach(function(msg) {
						// objects[msg.id] = {
						// 	id: msg.id
						// }
					// }
				});
			}
			if(messages[0].schema.id === 1) {
				messages.forEach(function(msg) {
					
				});
			}
		}
	}
});