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
					name: "archers",
					baseUrl: "src/",
					mainConfigFile: "src/bootstrap.js",
					out: "js/archers.js",
					optimize: 'uglify',
					preserveLicenseComments: false,
					wrap: {
						start: "if(!window.pc) { window.pc = {}; pc.VERSION = '0.5.6'; }",
					},
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