define(['lodash', 'ractive', 'data', 'text!tpl/servers.html'],
	function (_, Ractive, data, serversTpl) {
		"use strict";
		var container = document.querySelector(".server-browser"),
			poller = _.throttle(pollServers, 5000),
			ractive;

		if(container) {
			ractive = new Ractive({
				el: container,
				template: serversTpl,
				data: {
					servers: data
				}
			});

			ractive.on("pollServers", poller);
			poller();
		}

		function onMessage(msg) {
			var ws = msg.target,
				servers = ractive.get("servers"),
				server = _.findWhere(servers, {"socket":msg.origin}),
				index = _.indexOf(servers, server),
				decoded;


			if(msg.data == "!" && server.pingRequestSent) {
				// returns our ping
				server.ping = Date.now() - server.pingRequestSent;
				ws.close();
			} else {
				decoded = JSON.parse(msg.data);
				_.extend(server, decoded);
				server.pingRequestSent = Date.now();
				server.synced = true;
				ws.send("?");
			}

			server.failed = false;

			ractive.set("servers["+index+"]", server);
		}

		function onError(ev) {
			var ws = ev.target,
				servers = ractive.get("servers"),
				server = _.findWhere(servers, {"socket":ws.url}),
				index = _.indexOf(servers, server);

			server.failed = true;
			console.log(server);
			ractive.set("servers["+index+"]", server);
			return false;
		}

		function pollServers() {
			console.log("polling servers...");
			data.forEach(function(server) {
				var ws = new WebSocket(server.socket);
				ws.onopen = function() {
					ws.onmessage = onMessage;
				};
				ws.onerror = onError;
			});
		}
});