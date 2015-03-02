module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');

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
				files: ['src/js/*.js'],
				tasks: ['jshint']
			},

			cssComp: {
	
				files: ['src/scss/*.scss','src/scss/modules/*.scss'],
				tasks: ['sass']
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
					'src/css/style.min.css' : 'src/css/*.css'
 		 		}
 		 	}
 		 },

 		 uglify: {
 		 	build: {
 		 		src: 'src/js/scripts.js',
 		 		dest: 'src/js/scripts.min.js'
 		 	}
 		 }	
	});

	grunt.registerTask('runServ', [
		'connect:server',
		'watch'
	]);
};