module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
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
	});
};