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
					out: "public/js/archers.js",
					optimize: 'none', // neet to remove console.log before minification
					include: ['bootstrap'],
					insertRequire: ['bootstrap'],
					preserveLicenseComments: false,
					wrap: {
						start: "(function() { if(!window.pc) { window.pc = {}; pc.VERSION = '0.5.6'; }",
						end: "}());"
					}
				}
			}
		},
		replace: {
			dist: {
				options: {
					variables: {
						'timestamp': '<%= new Date().getTime() %>'
					},
					prefix: '@@'
				},
			files: [
				{expand: true, flatten: true, src: ['assets/index.html'], dest: 'public/'}
				]
			}
		},
		removelogging: {
			dist: {
				src: "public/js/archers.js",
				dest: "public/js/archers.js",
			},
		},
		uglify: {
			archers: {
				files: {
				'public/js/archers.js': ["public/js/archers.js"]
				}
			}
		}
	});


	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-bower-requirejs');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-replace');
	grunt.loadNpmTasks("grunt-remove-logging");
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('build', ['requirejs', 'removelogging', 'uglify', 'replace']);
	grunt.registerTask('test', ['karma']);
};