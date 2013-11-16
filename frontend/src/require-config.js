requirejs.config({
	baseUrl: 'src/',
	paths: {
		lodash: '../bower_components/lodash/dist/lodash.compat',
		playcraft: '../bower_components/playcraftengine/playcraftjs/lib',
		jquery: '../bower_components/jquery/jquery',
		virtualjoystick: '../bower_components/virtualjoystick/index',
		text: '../bower_components/requirejs-text/text',
		ractive: '../bower_components/ractive/build/Ractive',
		gamecore: '../bower_components/gamecore.js/gamecore'
	},
	// enforceDefine: true,
	shim: {
		'playcraft/boot': ['gamecore', 'playcraft/ext/box2dweb.2.1a-pc'],
		'playcraft/ext/base64': ['playcraft/boot'],
		'playcraft/input': ['playcraft/boot'],
		'playcraft/hashmap': ['playcraft/boot'],
		'playcraft/tools': ['playcraft/boot'],
		'playcraft/color': ['playcraft/boot'],
		'playcraft/debug': ['playcraft/boot'],
		'playcraft/device': ['playcraft/boot'],
		'playcraft/sound': ['playcraft/boot'],
		'playcraft/layer': ['playcraft/boot'],
		'playcraft/entitylayer': ['playcraft/boot'],
		'playcraft/tileset': ['playcraft/boot'],
		'playcraft/tilemap': ['playcraft/boot', 'playcraft/ext/base64'],
		'playcraft/tilelayer': ['playcraft/boot'],
		'playcraft/hextilelayer': ['playcraft/boot'],
		'playcraft/entity': ['playcraft/boot'],
		'playcraft/sprite': ['playcraft/boot'],
		'playcraft/spritesheet': ['playcraft/boot'],
		'playcraft/math': ['playcraft/boot'],
		'playcraft/image': ['playcraft/boot'],
		'playcraft/scene': ['playcraft/boot'],
		'playcraft/game': ['playcraft/boot'],
		'playcraft/loader': ['playcraft/boot'],
		'playcraft/dataresource': ['playcraft/boot'],
		'playcraft/components/component': ['playcraft/boot'],
		'playcraft/components/physics': ['playcraft/boot'],
		'playcraft/components/alpha': ['playcraft/boot'],
		'playcraft/components/joint': ['playcraft/boot'],
		'playcraft/components/expiry': ['playcraft/boot'],
		'playcraft/components/originshifter': ['playcraft/boot'],
		'playcraft/components/spatial': ['playcraft/boot'],
		'playcraft/components/overlay': ['playcraft/boot'],
		'playcraft/components/clip': ['playcraft/boot'],
		'playcraft/components/activator': ['playcraft/boot'],
		'playcraft/components/input': ['playcraft/boot'],
		'playcraft/components/fade': ['playcraft/boot'],
		'playcraft/components/spin': ['playcraft/boot'],
		'playcraft/components/scale': ['playcraft/boot'],
		'playcraft/components/rect': ['playcraft/boot'],
		'playcraft/components/poly': ['playcraft/boot'],
		'playcraft/components/circle': ['playcraft/boot'],
		'playcraft/components/text': ['playcraft/boot'],
		'playcraft/components/sprite': ['playcraft/boot'],
		'playcraft/components/layout': ['playcraft/boot'],
		'playcraft/components/particleemitter': ['playcraft/boot'],
		'playcraft/systems/system': ['playcraft/boot'],
		'playcraft/es/entitymanager': ['playcraft/boot'],
		'playcraft/es/systemmanager': ['playcraft/boot'],
		'playcraft/systems/entitysystem': ['playcraft/boot'],
		'playcraft/systems/physics': ['playcraft/boot'],
		'playcraft/systems/effects': ['playcraft/boot'],
		'playcraft/systems/particles': ['playcraft/boot'],
		'playcraft/systems/input': ['playcraft/boot'],
		'playcraft/systems/expiry': ['playcraft/boot'],
		'playcraft/systems/activation': ['playcraft/boot'],
		'playcraft/systems/render': ['playcraft/boot'],
		'playcraft/systems/layout': ['playcraft/boot']
	}
});


require(['bootstrap']);
// 	function (pc, Archers) {
// 		console.log('dsadasd');
// 		debugger;
// 		window.Archers = Archers;
// 		pc.device.boot('game', 'Archers');
// });