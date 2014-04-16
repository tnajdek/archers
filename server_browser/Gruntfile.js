module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		less: {
			develop: {
				options: {
					compress: false,
					yuicompress: false,
					dumpLineNumbers: 'all'
				},
				files: {
					"build/css/archers.css": "src/less/archers.less"
				}
			},
			production: {
				options: {
					optimization: 0,
					compress: true,
					yuicompress: true
				},
				files: {
					"build/css/archers.css": "src/less/archers.less"
				}
			}
		},
		autoprefixer: {
			develop: {
				src: 'build/css/archers.css'
			},
			production: {
				src: 'build/css/archers.css'
			}
		},
		requirejs: {
			compile: {
				options: {
					name: "../bower_components/almond/almond",
					baseUrl: "src/js/",
					mainConfigFile: "src/js/require-config.js",
					out: "build/js/main.js",
					optimize: 'none', // neet to remove console.log before minification
					include: ['main'],
					insertRequire: ['main'],
					stubModules: ['text'],
					preserveLicenseComments: false,
				}
			}
		},
		uglify: {
			production: {
				options: {},
				files: {
					'build/js/main.js': 'build/js/main.js'
				}
			}
		},
		watch: {
			less: {
				files: ['src/less/*.*ss',  'src/less/**/*.*ss'],
				tasks: ['less:develop', 'autoprefixer:develop'],
				options: {
					spawn: false,
				}
			},
			pages: {
				files: ["src/pages/*.hbs", "src/layouts/*.hbs", "src/includes/*.hbs"],
				tasks: ["assemble"]
			}
		},
		connect: {
			server: {
				options: {
					port: 8000,
					hostname: '*',
					base: 'build/'
				}
			}
		},
		assemble: {
			options: {
					assets: 'assets',
					plugins: ['permalinks'],
					partials: ['src/includes/*.hbs'],
					layoutdir: 'src/layouts',
					layout: ['default.hbs'],
					helpers: ['yfm', "handlebars-helpers", "helpers/helper.js"],
					buildTimestamp: new Date().getTime(),
					buildYear: new Date().getFullYear(),
					debug: grunt.option('target') == 'develop'
			},
			index: {
				options: {
					flatten: true
				},
				files: {
					'build/': ['src/pages/*.hbs']
				}
			}
		},
		clean: {
			build :['build']
		},
		symlink: {
			fonts: {
				src: 'src/fonts',
				dest: 'build/fonts'
			},
			img: {
				src: 'src/img',
				dest: 'build/img'
			},
			logo: {
				src: '../frontend/gfx/archers.svg',
				dest: 'build/img/logo.svg'
			},
			develop: {
				files: [
					{
						src: 'bower_components',
						dest: 'build/bower_components'
					},
					{
						src: 'src/js',
						dest: 'build/js'
					}
				]
			}
		},
		font: {
			icons: {
				src: ['src/icons/*.svg'],
				destCss: 'src/less/icons.less',
				destFonts: "src/fonts/icons.\{svg,woff,eot,ttf\}",
				cssFormat: 'less',
				cssRouter: function(fontpath) {
					return '/fonts/' + fontpath.split('/').pop();
				}
			}
		}
	});

	grunt.loadNpmTasks('assemble');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-symlink');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-fontsmith');

	grunt.registerTask('default', [
		'clean:build',
		'symlink:fonts',
		'symlink:img',
		'symlink:logo',
		'symlink:develop',
		'less:develop',
		'autoprefixer:develop',
		'assemble',
		'connect',
		'watch'
	]);
	grunt.registerTask('build', [
		'clean:build',
		'symlink:fonts',
		'symlink:img',
		'symlink:logo',
		'requirejs',
		'uglify:production',
		'less:production',
		'autoprefixer:production',
		'assemble'
	]);
};