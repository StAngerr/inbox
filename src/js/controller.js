var inbox=angular.module('inbox',[]);

inbox.controller('TasksCtrl', function($scope,$http) {

	  $scope.toggles = [{ state: true }, { state: false }, { state: true }];


	  $http.get('src/content/tasks.json').success(function(data, status, headers, config) {
     	 $scope.tasks = data;
      });
	  
});

inbox.controller('CommentsCtrl', function($scope,$http) {

	$http.get('src/content/comments.json').success(function(data, status, headers, config) {
     	$scope.comments = data;
      });
});