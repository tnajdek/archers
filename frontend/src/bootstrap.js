define(['pc', 'archers'],
	function (pc, Archers) {
		window.Archers = Archers;
		pc.device.boot('game', 'Archers');
});