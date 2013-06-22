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
				rjsConfig: 'src/archers.js'
			}
		},
		requirejs: {
			compile: {
				options: {
					name: "archers",
					baseUrl: "src/",
					mainConfigFile: "src/archers.js",
					out: "js/archers.js"
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