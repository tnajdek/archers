define(['pc', 'archers'],
	function (pc, Archers) {

		// extend dumb localStorage
		Storage.prototype.setObject = function(key, value) {
			this.setItem(key, JSON.stringify(value));
		};

		Storage.prototype.getObject = function(key) {
			var value = this.getItem(key);
			return value && JSON.parse(value);
		};

		window.Archers = Archers;
		
		pc.device.showDebug = false;
		pc.device.devMode = false;
		pc.device.boot('game', 'Archers');
});