var inbox = angular.module('inbox',['tastks-filter','comments-list','ngRoute']);

inbox.config(['$routeProvider',function($routeProvide) {
	$routeProvide
		.when('/state/:state/task/:id',{
			templateUrl : 'src/js/templates/new.html',
			controller : 'subCtrl'
		})
		.otherwise({
			redirectTo: '/'
		});
}]);

inbox.controller('mainCtrl',['$scope','$routeParams','$location','$rootScope', function($scope,$routeParams,$location,$rootScope) {
	$scope.obj = {};

	$scope.commentsToTask = [];
	
	$scope.searchFieldInput = '';

} ]);