var inbox=angular.module('inbox',[]);

inbox.controller('tasksFilterCtrl', function() {
	this.active = 1;

	this.setActive = function(value) {
		this.active = value;
	};

	this.isSelected = function(value) {
		return this.active == value;
	};

	this.categoriesSelect = function(event) {
		var element =  event.currentTarget;

		if(!$(element).hasClass('active')){
			$('.categories').removeClass('active');
			$(element).addClass('active');
		} 
	};
});

inbox.controller('TasksCtrl', function($scope,$http) {

	
	$scope.searchAnimationEvent = function() {
		$('#searchField').css({'display' : 'block'});
		$('#searchField').focus();
		 $('#searchField').blur(function() {
		 	$(this).css({'display' : 'none'});
		 });
	};

	$http.get('src/content/tasks.json').success(function(data, status, headers, config) {
		 $scope.tasks = data;
	});

	$scope.openComment = function(event) {
		var element =  event.currentTarget;
		var a;
		
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