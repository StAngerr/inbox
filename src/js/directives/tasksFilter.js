(function() {

	var app=angular.module('tastks-filter',[]);



	app.directive('tasksList', function() {
        var directive = {
            restrict: 'E',
            templateUrl: 'src/js/templates/tasksTempl.html'
        };
        return directive;
    });

	app.directive('taskFilter', function() {
		return {
			strict : 'E',
			templateUrl : 'src/js/templates/taskFilterTempl.html'
		}
	});

	app.controller('TasksFilterCtrl',['$rootScope', '$scope','$http','$filter', function($rootScope, $scope, $http,$filter) {
		$scope.curStatus = 'your';
		$scope.active = 1;
		
		$scope.yoursTasks = 0;
		$scope.unassignedTasks = 0;

		$scope.tasks = [];
		$scope.filteredTasks =  [];

		$http.get('src/content/tasks.json').success(function(data, status, headers, config) {
			$scope.tasks = data;

			for (var i=0; i < data.length; i++) {
				if(data[i].status === 'your') {
					$scope.yoursTasks++;
				} else if(data[i].status === 'unassigned') {
					$scope.unassignedTasks++;
				}
			}

			$scope.allTasks = $scope.unassignedTasks + $scope.yoursTasks;
		});

		addLogo();

		$scope.setActive = function(value) {
			var openedElem;
			$('.taskItem').addClass('activeTask');
			if(value === 1) {
				$scope.curStatus = 'your';
			} else if(value === 2) {
				$scope.curStatus = 'unassigned';
			} else {
				$scope.curStatus = '';
			}
			if( $('.mainContentInner').css('display') == 'block' ) {
				hideMainContent();
				addLogo();
			}
			$scope.active = value;
				
		};

		$scope.isSelected = function(value) {
			return $scope.active == value;
		};

		$scope.openComment = function(event) {
			var element =  event.currentTarget;
			$('.newCommentExpanded .newCommentExpanded *').css({'opacity' : '0'})
			$('.newComment').removeClass('newCommentExpanded');

			if ( $('.taskItem.activeTask').length == $('.taskItem').length ) {
				toggleActiveClass(element);

				initClickedObj(element);

				removeLogo();

				removePreloader();

				if($(window).width() > 620 ) addPreloader();

				initComments();

				openNewTaskAnimation();

				

			} else if ( $(element).hasClass('activeTask') ) {

				hideMainContent();
				addLogo();

				$('.taskItem').addClass('activeTask');
			} else {
				toggleActiveClass(element);
				
				initClickedObj(element);

				removePreloader();  

				removeLogo();

				if($(window).width() > 620 ) addPreloader();

				initComments();

				openNewTaskAnimation();  
			}

			if( $(window).width() < 620) {
				$('*').removeClass('slideRight');
				$('#navigation').addClass('slideLeft');
				$('#mainContent').addClass('slideLeft');
				removeLogo();
			}
		
		};

		function paintedTasks() {
			var allList = $('.taskItem');

			for(listItem in allList) {
				if( $(listItem).attr('category') == 'your') {
					$(listItem).css({'background' : 'green'});
				} else if( $(listItem).attr('category') == 'unassigned' ) {
					$(listItem).css({'background' : 'red'});
				} 
			}
		}

		function openNewTaskAnimation() {
			$('.mainContentInner').css({'display' : 'none','opacity' : '0'});
			$('.mainContentInner').css({'display' : 'block'}).animate({'opacity' : '1'}, 600);
		};

		function initComments() {
			$http.get($scope.$parent.obj.comments).success(function(data, status, headers, config) {
			     	$scope.$parent.commentsToTask = data;
			});
		};

		function toggleActiveClass(element) {
			$('.taskItem').removeClass('activeTask');
			$(element).addClass('activeTask');
		};

		function addLogo() {
		
			$('#mainContent').css({
				'opacity' : '0',
				'background' : '#fff url("src/images/inboxLogo1.png") no-repeat 50% 50%',
			}).animate({'opacity' : '1'},  1500);
		};

		function hideMainContent() {
			$('.mainContentInner').animate({'opacity' : '0'}, 300,function() {
				$(this).css({'display' : 'none','opacity' : '0'});
			});
		};

		function initClickedObj(element) {
			for (var i=0; i < $scope.tasks.length; i++ ) {
				if($scope.tasks[i].id === element.id) {
					$scope.$parent.obj = $scope.tasks[i];
				}
			}
		};

		function removeLogo() {
			$('#mainContent').css({
				'background' : '#fff',
				'opacity' : '1'
			});
		};

		function addPreloader() {
			$("#mainContent").append('<div id="fakeloader"></div>');
			$("#fakeloader").fakeLoader();
		};

		function removePreloader() {
			$("#fakeloader").remove();
		};

	}]);

	
})();