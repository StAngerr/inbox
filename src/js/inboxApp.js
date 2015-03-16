var inbox = angular.module('inbox',['tastks-filter','comments-list','ngRoute','LocalStorageModule']);

inbox.config(['$routeProvider',function($routeProvide) {
	$routeProvide
		.when('/state/:state/task/:id', {
			template : ' ',
			controller : 'subCtrl'
		})
		.otherwise({
			template :' '
		});
}]);

inbox.controller('mainCtrl',['$scope','$routeParams','$location','$rootScope', function($scope,$routeParams,$location,$rootScope) {
	$scope.obj = {};

	$scope.commentsToTask = [];
	
	$scope.searchFieldInput = '';

} ]);