var inbox=angular.module('inbox',[]);

inbox.controller('TasksFilterCtrl', function() {
	this.active = 1;

	this.setActive = function(value) {
		this.active = value;
	};

	this.isSelected = function(value) {
		return this.active == value;
	};
});

inbox.controller('SearchFieldCtrl', function() {
	this.searchAnimationEvent = function() {
		$('#searchField').css({'display' : 'block'}).focus();
		
		$('#searchField').blur(function() {
		 	$(this).css({'display' : 'none'});
		});
	};
});

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

inbox.controller('ExpandedTaskCtrl', function($scope) {
	$scope.returnBtn = function() {
		$('*').removeClass('slideLeft');
		$('#navigation').addClass('slideRight');
		$('#mainContent').addClass('slideRight');
		$('.taskItem').addClass('activeTask');
	};
});

inbox.controller('CommentsCtrl', function($scope,$http) {

	$http.get('src/content/comments.json').success(function(data, status, headers, config) {
     	$scope.comments = data;
      });
});