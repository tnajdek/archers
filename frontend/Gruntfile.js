module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		mocha: {
			test: {
				src: ['test/*.html'],
				options: {
					run: true
				}
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

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-mocha');
	grunt.loadNpmTasks('grunt-contrib-requirejs');

	grunt.registerTask('build', ['requirejs']);
	grunt.registerTask('test', ['requirejs', 'mocha']);
};