(function() {
	var app=angular.module('comments-list',[]);

	app.directive('commentsList', function() {
		return {
			strict : 'E',
			templateUrl : 'src/js/templates/commentsTmpl.html'
		}
	});
	
})();