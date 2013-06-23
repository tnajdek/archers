requirejs.config({
	baseUrl: 'src/',
	paths: {
		lodash: '../components/lodash/dist/lodash.compat',
		MelonJS: '../components/MelonJS/build/melonJS-0.9.7-amd'
	}
});

requirejs(['lodash', 'MelonJS', 'resources', 'networking', "screens/main", 'entities/archer'],
	function (_, me, resources, Networking, MainScreen, Archer) {
	me.sys.useNativeAnimFrame = true;
	me.video.init("game", window.innerWidth, window.innerHeight, true, "auto");
	// window.onresize = function() {
	// 	me.video.init("game", window.innerWidth, window.innerHeight, true, 1.0);
	// }

	me.sys.dirtyRegion = true;
	me.debug.renderDirty = false;

	me.loader.onload = function() {
		// debugger;
		me.state.set(me.state.PLAY, new MainScreen(true));
		me.state.change(me.state.PLAY);
		me.entityPool.add("archer", Archer);
		Networking.init();
	};

	me.loader.preload(resources);
	me.state.change(me.state.LOADING);


	
});