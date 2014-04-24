define(['lodash', 'vent', 'messaging', 'messaging/useraction'],
	function(_, vent, Messaging, UserActionMessage) {
	return function() {
		var that = this;
		this.ws = new WebSocket("ws://"+window.location.hostname+":9000");
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

		// this.onUsernameChange = function(e) {
		// 	var metamsg;
		// 	if(e && e.length){
		// 		metamsg = {
		// 			"username": e
		// 		};
		// 		that.ws.send(JSON.stringify(metamsg));
		// 	}
		// };

		this.onMetaChange = function(e) {
			that.ws.send(JSON.stringify(e));
		};

		this.onmessage = function(e) {
			if(e.data instanceof ArrayBuffer) {
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
				if(messages[0].schema.id === 5) {
					messages.forEach(function(msg) {
						vent.trigger('event', msg);
					});
				}
			} else {
				msg = JSON.parse(e.data);
				if(msg.map) {
					// server_pack
				}
				else if(msg.session_id) {
					that.onWelcomeMsg(msg);
				} else {
					console.info("meta update from srv", msg);
					vent.trigger('meta', msg);
				}
			}
		};

		this.ws.onopen = function() {
			var initMsg = new UserActionMessage({
				action: 'init',
				direction: ''
			});
			that.ws.onmessage = that.onmessage;
			that.ws.send(Messaging.toBuffer([initMsg]));
		};

		this.onWelcomeMsg = function(msg) {
			vent.trigger('connected');
			vent.on('spawn', that.onspawn);
			vent.on('input', that.oninput);

			// vent.on('username', that.onUsernameChange);
			vent.on('customize:end', that.onMetaChange);
			vent.on('localAccountFound', that.onMetaChange);
			vent.trigger('welcome', msg);
		};

		this.ws.onclose = function(e) {
			vent.trigger('disconnected', e);
		};
	};
});