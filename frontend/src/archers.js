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
		console.log(Messaging.fromBuffer(e.data));
		// console.log(e.data);
		}
	};
});