var inbox = angular.module('inbox',['tastks-filter','comments-list','ngRoute','LocalStorageModule']);

inbox.config(['$routeProvider',function($routeProvide) {
	$routeProvide
		.when('/state/:state/task/:id', {
			template : ' ',
			controller : 'subCtrl'
		})
		.when('/user/:id/task/:id', {
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


	
	$scope.alert11 =  function() {
 		$('.filterWrap > cur-user-tasks').remove();
		$('.filterWrap > user-overview').remove();
 		
 		$location.path('/state/1/task/none');

 		$('.navHeader > .returnBtn').remove();
 	}   
} ]);