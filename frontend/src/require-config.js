requirejs.config({
	baseUrl: 'src/',
	paths: {
		lodash: '../bower_components/lodash/dist/lodash.compat',
		playcraft: '../bower_components/playcraftengine/playcraftjs/lib',
		jquery: '../bower_components/jquery/jquery',
		virtualjoystick: '../bower_components/virtualjoystick.js/virtualjoystick',
		text: '../bower_components/requirejs-text/text',
		ractive: '../bower_components/ractive/ractive',
		ractiveTapEvent: '../bower_components/ractive-events-tap/Ractive-events-tap',
		gamecore: '../bower_components/gamecore.js/gamecore'
	},
	// enforceDefine: true,
	shim: {
		'virtualjoystick': {
			exports: 'VirtualJoystick'
		},
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
		'playcraft/entitylayer': ['playcraft/boot', 'playcraft/layer'],
		'playcraft/tileset': ['playcraft/boot'],
		'playcraft/tilemap': ['playcraft/boot', 'playcraft/ext/base64'],
		'playcraft/tilelayer': ['playcraft/boot', 'playcraft/layer'],
		'playcraft/hextilelayer': ['playcraft/boot', 'playcraft/layer', 'playcraft/tilelayer'],
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
		'playcraft/components/physics': ['playcraft/boot', 'playcraft/components/component'],
		'playcraft/components/alpha': ['playcraft/boot', 'playcraft/components/component'],
		'playcraft/components/joint': ['playcraft/boot', 'playcraft/components/component'],
		'playcraft/components/expiry': ['playcraft/boot', 'playcraft/components/component'],
		'playcraft/components/originshifter': ['playcraft/boot', 'playcraft/components/component'],
		'playcraft/components/spatial': ['playcraft/boot', 'playcraft/components/component'],
		'playcraft/components/overlay': ['playcraft/boot', 'playcraft/components/component'],
		'playcraft/components/clip': ['playcraft/boot', 'playcraft/components/component'],
		'playcraft/components/activator': ['playcraft/boot', 'playcraft/components/component'],
		'playcraft/components/input': ['playcraft/boot', 'playcraft/components/component'],
		'playcraft/components/fade': ['playcraft/boot', 'playcraft/components/component'],
		'playcraft/components/spin': ['playcraft/boot', 'playcraft/components/component'],
		'playcraft/components/scale': ['playcraft/boot', 'playcraft/components/component'],
		'playcraft/components/rect': ['playcraft/boot', 'playcraft/components/component'],
		'playcraft/components/poly': ['playcraft/boot', 'playcraft/components/component'],
		'playcraft/components/circle': ['playcraft/boot', 'playcraft/components/component'],
		'playcraft/components/text': ['playcraft/boot', 'playcraft/components/component'],
		'playcraft/components/sprite': ['playcraft/boot', 'playcraft/components/component'],
		'playcraft/components/layout': ['playcraft/boot', 'playcraft/components/component'],
		'playcraft/components/particleemitter': ['playcraft/boot', 'playcraft/components/component'],
		'playcraft/systems/system': ['playcraft/boot'],
		'playcraft/es/entitymanager': ['playcraft/boot'],
		'playcraft/es/systemmanager': ['playcraft/boot'],
		'playcraft/systems/entitysystem': ['playcraft/boot', 'playcraft/systems/system'],
		'playcraft/systems/physics': ['playcraft/boot', 'playcraft/systems/entitysystem'],
		'playcraft/systems/effects': ['playcraft/boot', 'playcraft/systems/entitysystem'],
		'playcraft/systems/particles': ['playcraft/boot', 'playcraft/systems/entitysystem'],
		'playcraft/systems/input': ['playcraft/boot', 'playcraft/systems/entitysystem'],
		'playcraft/systems/expiry': ['playcraft/boot', 'playcraft/systems/entitysystem', 'playcraft/components/component'],
		'playcraft/systems/activation': ['playcraft/boot', 'playcraft/systems/entitysystem'],
		'playcraft/systems/render': ['playcraft/boot', 'playcraft/systems/entitysystem'],
		'playcraft/systems/layout': ['playcraft/boot', 'playcraft/systems/entitysystem']
	}
});


require(['bootstrap']);
// 	function (pc, Archers) {
// 		console.log('dsadasd');
// 		debugger;
// 		window.Archers = Archers;
// 		pc.device.boot('game', 'Archers');
// });