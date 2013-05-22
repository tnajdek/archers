// WAMP session object
var sess = null;
 
window.onload = function() {
 
   var wsuri;
   if (window.location.protocol === "file:") {
      wsuri = "ws://localhost:9000";
   } else {
      wsuri = "ws://" + window.location.hostname + ":9000";
   }
 
   // connect to WAMP server
   ab.connect(wsuri,
 
      // WAMP session was established
      function (session) {
 
         sess = session;
 
         console.log("Connected to " + wsuri);
         test();
      },
 
      // WAMP session is gone
      function (code, reason) {
 
         sess = null;
 
         if (code == ab.CONNECTION_UNSUPPORTED) {
            window.location = "http://autobahn.ws/unsupportedbrowser";
         } else {
            alert(reason);
         }
      }
   );
};
 
function test() {
   // call a function with multiple arguments
   sess.call("http://localhost/rpc#add", 23, 7).then(
      function (res) {
         console.log("RPC result: " + res);
      },
      function (error) {
         console.log("RPC error: " + error.desc);
      }
   );
};