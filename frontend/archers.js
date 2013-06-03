var ws = new WebSocket("ws://localhost:9000");
ws.onopen = function() {
   console.log('a');
};