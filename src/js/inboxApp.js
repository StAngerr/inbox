var inbox = angular.module('inbox',['tastks-filter','comments-list']);

inbox.controller('mainCtrl',function($scope) {
	$scope.obj = {};
	$scope.commentsToTask;
	$scope.searchFieldInput = '';
});