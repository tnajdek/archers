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
					name: "../bower_components/almond/almond",
					baseUrl: "src/",
					mainConfigFile: "src/require-config.js",
					out: "public/js/archers.js",
					optimize: 'none', // neet to remove console.log before minification
					include: ['bootstrap'],
					insertRequire: ['bootstrap'],
					stubModules: ['text'],
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
		},
		less: {
			develop: {
				options: {
					compress: false,
					yuicompress: false,
					dumpLineNumbers: 'all'
				},
				files: {
					"css/archers.css": "less/archers.less"
				}
			},
			production: {
				options: {
					optimization: 0,
					compress: true,
					yuicompress: true
				},
				files: {
					"css/archers.css": "less/archers.less"
				}
			}
		},
		watch: {
			less: {
				files: ['less/*.less', 'src/less/**/*.less'],
				tasks: ['less:develop'],
				options: {
					spawn: false,
				}
			}
		},
		connect: {
			server: {
				options: {
					port: 8080,
					hostname: '*',
					base: '.'
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
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');

	grunt.registerTask('develop', ['less:develop']);
	grunt.registerTask('build', ['requirejs', 'removelogging', 'uglify', 'replace']);
	grunt.registerTask('test', ['karma']);
	grunt.registerTask('default', ['less:develop', 'connect', 'watch']);
};