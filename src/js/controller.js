var inbox=angular.module('inbox',[]);

inbox.controller('TasksCtrl', function($scope,$http) {

	/*SEARCH event*/
	$scope.searchAnimationEvent = function() {
		/*$('#searchField')*/
/*			$('#searchField').css({'visibility' : 'visible'});*/
		$('#searchField').css({'visibility' : 'visible'}).addClass('.borderAnim');
		$('#searchField').focus();
	};
	/*   */

	$http.get('src/content/tasks.json').success(function(data, status, headers, config) {
		 $scope.tasks = data;
	});

	$scope.openComment = function(event) {
		var element =  event.currentTarget;
		
		if () {
			
		}

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