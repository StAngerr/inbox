inbox.controller('TasksCtrl', function($scope, $http) {
	$http.get('src/content/tasks.json').success(function(data, status, headers, config) {
		 $scope.tasks = data;
	});

	$scope.openComment = function(event) {
		var element =  event.currentTarget;
		
		if ($('.taskItem.activeTask').length == $('.taskItem').length) {
			$('.taskItem').removeClass('activeTask');
			$(element).addClass('activeTask');
		} else if ($(element).hasClass('activeTask')) {
			$('.taskItem').addClass('activeTask');
		} else {
			$('.taskItem').removeClass('activeTask');
			$(element).addClass('activeTask');
		}

		if( $(window).width() < 620) {
			$('*').removeClass('slideRight');
			$('#navigation').addClass('slideLeft');
			$('#mainContent').addClass('slideLeft');
		}

	};
});
