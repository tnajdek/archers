requirejs.config({
	baseUrl: 'js/',
	paths: {
		text: '../bower_components/requirejs-text/text',
		ractive: '../bower_components/ractive/ractive',
		lodash: '../bower_components/lodash/dist/lodash'
	},
	// enforceDefine: true,
	shim: {
	}
});


require(['main']);