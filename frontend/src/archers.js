// var ws = new WebSocket("ws://localhost:9000");
// ws.binaryType = 'arraybuffer'

// ws.onopen = function() {
//    ws.onmessage = function(e) {
//       console.log(e.data);
//    }
// };

requirejs(['messaging', 'lib/lodash'], function (Messaging, _) {
	var ws = new WebSocket("ws://localhost:9000");
	ws.binaryType = 'arraybuffer'
	ws.onopen = function() {
		var objects = {},

		domel = document.getElementById('update');
		ws.onmessage = function(e) {
			messages = Messaging.fromBuffer(e.data);
			if(messages[0].schema.id === 2) {
				messages.forEach(function(msg) {
					if(msg.remove) {
						delete objects[messages[0].id];
					} else {
						objects[msg.id] = {
							id: msg.id
						}
					}
				});
			}
			if(messages[0].schema.id === 1) {
				messages.forEach(function(msg) {
					if(objects[msg.id]) {
						objects[msg.id].x = msg.x;
						objects[msg.id].y = msg.y;
					}
				});
			}
			console.log(objects);
			domel.textContent = '';
			_.forEach(objects, function(object) {
				domel.textContent += 'object '+object.id+':  x:'+object.x+', y:'+object.y+"\n";
			});
		}
	};
});