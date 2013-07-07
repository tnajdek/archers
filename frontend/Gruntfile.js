module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		karma: {
			unit: {
				configFile: 'karma.conf.js',
				autoWatch: true
			}
		},
		bower: {
			target: {
				rjsConfig: 'src/bootstrap.js'
			}
		},
		requirejs: {
			compile: {
				options: {
					name: "../components/almond/almond",
					baseUrl: "src/",
					mainConfigFile: "src/require-config.js",
					out: "js/archers.js",
					optimize: 'uglify2',
					include: ['bootstrap'],
					insertRequire: ['bootstrap'],
					preserveLicenseComments: false,
					wrap: {
						start: "(function() { if(!window.pc) { window.pc = {}; pc.VERSION = '0.5.6'; }",
						end: "}());"
					}
				}
			}
		}
	});


	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-bower-requirejs');
	grunt.loadNpmTasks('grunt-karma');

	grunt.registerTask('build', ['requirejs']);
	grunt.registerTask('test', ['karma']);
};