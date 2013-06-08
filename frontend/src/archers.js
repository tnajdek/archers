// var ws = new WebSocket("ws://localhost:9000");
// ws.binaryType = 'arraybuffer'

// ws.onopen = function() {
//    ws.onmessage = function(e) {
//       console.log(e.data);
//    }
// };

requirejs(['interface'], function (interface_) {
	console.log(interface_);
});