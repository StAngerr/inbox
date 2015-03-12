module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-concat-css');

	grunt.initConfig({

		jshint: {
			
			options: {

			},

			files: {
				src: 'src/js/*.js'
			}
		},

		watch: {
			css: {
				options:{
					livereload: true
				},
				files: ['**/*.css','**/*.html']
			},
			javaScript: {
				options:{
					livereload: true
				},
				files: ['src/js/directives/*.js'],
				tasks: ['buildJS','jshint']
			},

			cssComp: {
	
				files: ['src/scss/*.scss','src/scss/modules/*.scss'],
				tasks: ['sass','buildCss']
			},
		},

		connect: {
		    server: {
		      options: {
		        port: 9009,
		        base: 'D:/git_prj/INBOX/',
		        livereload: true,
		      }
		    }
 		},

 		 sass: {
 		 	dist: {
 		 		options: {
					style: 'expanded'
				},
 		 		files: {
 		 			'src/css/styles.css' : 'src/scss/styles.scss'
 		 		}
 		 	}
 		 },

 		 cssmin: {
 		 	target: {
 		 		files: {
					'dist/css/styles.min.css' : 'dist/css/styles.css'
 		 		}
 		 	}
 		 },

 		 concat_css: {
		    options: {},
		    all: {
		    	src: ['src/css/bootstrap.css','src/css/styles.css', 'src/css/fakeLoader.css'],
      			dest: "dist/css/styles.css"
		    },
  		 },

 		 uglify: {
 		 	build: {
 		 		src: 'dist/scripts/scripts.js',
 		 		dest: 'dist/scripts/scripts.min.js'
 		 	}
 		 },
		concat: {
			farmeworks: {
			  src: ['bower_components/jquery/dist/jquery.js', 
			  'bower_components/modernizr/modernizr.js',
			  'bower_components/angular/angular.js',
			  'bower_components/angular-route/angular-route.js',
			  'bower_components/angular-local-storage/dist/angular-local-storage.js',
			  'src/js/inboxApp.js',
			  'src/js/events.js',
			  'src/js/directives/tasksFilter.js',
			  'src/js/directives/commentsList.js',
			  'src/js/fakeLoader.js'			  
			  ],
			  dest: 'dist/scripts/scripts.js',
			},
		},	
	});

	grunt.registerTask('buildCss',['sass','concat_css','cssmin']);
	grunt.registerTask('buildJS',['concat','uglify']);
	grunt.registerTask('buildAll',['buildCss','buildJS']);

	grunt.registerTask('runServ', [
		'connect:server',
		'watch'
	]);
};