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
		uglify: {
			js: {
				options: {},
				files: {
					'build/js/main.js': ['src/js/*.js'],
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
				files: ["src/posts/*.hbs", "src/pages/*.hbs", "src/layouts/*.hbs", "src/includes/*.hbs", "src/data/*"],
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
					buildYear: new Date().getFullYear()
			},
			posts: {
				options: {
					flatten: true
				},
				src: ['src/posts/*.hbs'],
				dest: 'build/'
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
			js: {
				src: 'src/js',
				dest: 'build/js'
			},
			gh: {
				src: 'src/CNAME',
				dest: 'build/CNAME'
			}
		},
		'gh-pages': {
			options: {
				base: 'build'
			},
			src: ['**']
		}
	});


	grunt.loadNpmTasks('assemble');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-gh-pages');
	grunt.loadNpmTasks('grunt-contrib-symlink');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', [
		'clean:build',
		'symlink:fonts',
		'symlink:img',
		'symlink:logo',
		'symlink:js',
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
		'symlink:gh',
		'uglify:js',
		'less:production',
		'autoprefixer:production',
		'assemble'
	]);
	grunt.registerTask('deploy', ['build', 'gh-pages']);
};