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
			javaScript: {
				files: ['src/js/*.js'],
				tasks: ['jshint']
			}
		},

		connect: {
		    server: {
		      options: {
		        port: 9009,
		        base: 'E:/INBOX/',
		        livereload: true,
		      }
		    }
 		 },

 		 sass: {
 		 	dist: {
 		 		files: {
 		 			'src/css/styles.css' : 'src/scss/*.scss'
 		 		}
 		 	}
 		 },

 		 cssmin: {
 		 	options: {

 		 	},
 		 	target: {
 		 		files: {

 		 		}
 		 	}
 		 },

 		 uglify: {
 		 	
 		 }	
	});

	grunt.registerTask('runServ', [
		'connect:server',
		'watch'
	]);
};