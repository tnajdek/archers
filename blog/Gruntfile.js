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
					"build/css/archers.css": "less/archers.less"
				}
			},
			production: {
				options: {
					optimization: 0,
					compress: true,
					yuicompress: true
				},
				files: {
					"build/css/archers.css": "less/archers.less"
				}
			}
		},
		autoprefixer: {
			develop: {
				src: 'css/archers.css'
			},
		},
		watch: {
			less: {
				files: ['less/*.less', 'src/less/**/*.less'],
				tasks: ['less:develop', 'autoprefixer:develop'],
				options: {
					spawn: false,
				}
			},
			pages: {
				files: ["posts/*.hbs", "pages/*.hbs", "layouts/*.hbs", "includes/*.hbs", "data/*"],
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
					partials: ['includes/*.hbs'],
					layoutdir: 'layouts',
					layout: ['default.hbs'],
					helpers: ['yfm'],
					buildTimestamp: new Date().getTime(),
					buildYear: new Date().getFullYear()
			},
			posts: {
				options: {
					flatten: true
				},
				src: ['posts/*.hbs'],
				dest: 'build/'
			},
			index: {
				options: {
					flatten: true
				},
				files: {
					'build/': ['pages/*.hbs']
				}
			}
		},
		clean: {
			build :['build']
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

	grunt.registerTask('default', ['clean:build', 'less:develop', 'autoprefixer:develop', 'assemble', 'connect', 'watch']);
	grunt.registerTask('build', ['clean:build', 'less:production', 'autoprefixer:production', 'assemble']);
	grunt.registerTask('deploy', ['build', 'gh-pages']);
};