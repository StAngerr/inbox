var inbox=angular.module('inbox',[]);

inbox.controller('TasksCtrl', function($scope,$http) {

	$http.get('src/content/tasks.json').success(function(data, status, headers, config) {
		 $scope.tasks = data;
	});

	$scope.openComment = function(event) {
		var element =  event.currentTarget;

		if( $(window).width() < 620) {
			document.getElementById('navigation').style.marginLeft = '-50%';
		}
		$('.taskItem').addClass('activeTask');
		$(element).removeClass('activeTask');
	};

	$scope.returnBtn = function() {
		document.getElementById('navigation').style.marginLeft = '0%';
		$('.taskItem').removeClass('activeTask');
	}

	$scope.categoriesSelect = function(event) {
		var element =  event.currentTarget;

		if(!$(element).hasClass('active')){
			$('.categories').removeClass('active');
			$(element).addClass('active');
		} 
	}
});

inbox.controller('CommentsCtrl', function($scope,$http) {

	$http.get('src/content/comments.json').success(function(data, status, headers, config) {
     	$scope.comments = data;
      });
});