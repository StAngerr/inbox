
	var app=angular.module('tastks-filter',[]);

	app.directive('taskFilter',function() {
		return {
			strict : 'E',
			templateUrl : 'views/taskFilterView.html'
		}
	});
