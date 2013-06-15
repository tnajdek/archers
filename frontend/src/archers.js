// var ws = new WebSocket("ws://localhost:9000");
// ws.binaryType = 'arraybuffer'

// ws.onopen = function() {
//    ws.onmessage = function(e) {
//       console.log(e.data);
//    }
// };

requirejs(['messaging'], function (Messaging) {
	var ws = new WebSocket("ws://localhost:9000");
	ws.binaryType = 'arraybuffer'
	ws.onopen = function() {
		ws.onmessage = function(e) {
		messages = Messaging.fromBuffer(e.data);
		if(messages[0].schema.id === 2) {
			console.log(messages);
		}
		// console.log(e.data);
		}
	};
});