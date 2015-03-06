(function() {

	var app=angular.module('tastks-filter',[]);
/*DIRS*/
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

/*CONTROLLERS*/

	app.controller('SearchFieldCtrl',['$scope', function($scope) {
		$scope.searchAnimationEvent = function() {
			$('#searchField').css({'display' : 'block'}).focus();
			
			$('#searchField').blur(function() {
				$scope.$parent.searchFieldInput = '';
			 	$(this).css({'display' : 'none'}); 	
			});
		};
	}]);

	app.controller('TasksFilterCtrl',['$scope','$http','$routeParams','$location','$rootScope',  function($scope, $http, $routeParams, $location, $rootScope) {
		$scope.curStatus = 'your';
		$scope.active = 1;
		
		$scope.yoursTasks = 0;
		$scope.unassignedTasks = 0;

		$scope.tasks = [];

		$scope.activeTasks = {};		

		$http.get('src/content/tasks.json').success(function(data, status, headers, config) {
			$scope.tasks = data;

			for (var i=0; i < data.length; i++) {
				var id ="" + $scope.tasks[i].id;
				$scope.activeTasks[id] = true;

				if(data[i].status === 'your') {
					$scope.yoursTasks++;
				} else if(data[i].status === 'unassigned') {
					$scope.unassignedTasks++;
				}
			}


			$scope.allTasks = $scope.unassignedTasks + $scope.yoursTasks;
		});

		$scope.addLogo = function() {
			$('#mainContent').css({
				'opacity' : '0',
				'background' : '#fff url("src/images/inboxLogo1.png") no-repeat 50% 50%',
			}).animate({'opacity' : '1'},  1500);
		};

		$scope.addLogo();

		$scope.setActive = function(value) {
			var openedElem;
			if(value == "null") {
				return;
			}
			if(value == 1) {
				$scope.curStatus = 'your';
			} else if(value == 2) {
				$scope.curStatus = 'unassigned';
			} else {
				$scope.curStatus = '';
			}
			$scope.active = value;		
		};

		$scope.isSelected = function(value) {
			return $scope.active == value;
		};

		$scope.urlState = "1";
		$scope.urlTask = "undefined";

	}]);



	app.controller('subCtrl',['$scope','$http','$routeParams','$location','$rootScope',function($scope, $http, $routeParams, $location, $rootScope) {
		$scope.$parent.urlState = $routeParams.state;
		$scope.$parent.urlTask = $routeParams.id;
		var url = $location.path().split("/");

		if(url.length > 3) {
			$scope.setActive(url[2]);
			
			openTask(url[4]);
		};

		$scope.changeUrlState = function(value) {
			$scope.urlTask = "undefined";
			for (var id in $scope.activeTasks) {
				$scope.activeTasks[id] = true;
			}	
			
			$scope.urlState = value;
			$location.path('/state/' + $scope.urlState + '/task/' + $scope.urlTask);
			
		};

		$scope.cangeUrlTaskId = function(event) {
			if(event.currentTarget.id == $scope.urlTask) {
				$scope.urlTask = "undefined";
			} else {
				$scope.urlTask = event.currentTarget.id;
			}
			$location.path('/state/' + ($scope.urlState || "1") + '/task/' + $scope.urlTask);
		};

		function openTask(id) {
			var curElemID =  id;
			
			if(curElemID == 'undefined') {
				hideMainContent();

				for (var id in $scope.activeTasks) {
					$scope.activeTasks[id] = true;
				}	
				$scope.addLogo();	
				return;
			}

			if ( $('.activeTask').length == $('.taskItem').length ) {
				for (var id in $scope.activeTasks) {
					if(curElemID == id) continue;
					$scope.activeTasks[id] = false;
				}
				removeLogo();

				initClickedObj(curElemID);

				initComments();

				removePreloader();

				if($(window).width() > 620 ) addPreloader();

				openNewTaskAnimation();

			} else if ( id == 'underfined' ) { 
				for (var id in $scope.activeTasks) {
					$scope.activeTasks[id] = true;
				}

				hideMainContent();

				$scope.addLogo();	
			} else if ( $('.activeTask').length == 1 ) {
				for (var id in $scope.activeTasks) {
					if(curElemID == id) {
						$scope.activeTasks[id] = true;
						continue;
					}	
					$scope.activeTasks[id] = false;
				}

				initClickedObj(curElemID);

				initComments();

				removePreloader();

				if($(window).width() > 620 ) addPreloader();

				openNewTaskAnimation();
			}


			if( $(window).width() < 620) {
				$('*').removeClass('slideRight');
				$('#navigation').addClass('slideLeft');
				$('#mainContent').addClass('slideLeft');
				removeLogo();
			}
		}


		function initClickedObj(id) {
			for (var i=0; i < $scope.tasks.length; i++ ) {
				if($scope.tasks[i].id === id) {
					$scope.$parent.$parent.obj = $scope.tasks[i];
				}
			}
		};

		function initComments() {
			$http.get($scope.$parent.obj.comments).success(function(data, status, headers, config) {
			     	$scope.$parent.$parent.commentsToTask = data;
			});
		};

		function removeLogo() {
			$('#mainContent').css({
				'background' : '#fff',
				'opacity' : '1'
			});
		};

		function openNewTaskAnimation() {
			$('.mainContentInner').css({'display' : 'none','opacity' : '0'});
			$('.mainContentInner').css({'display' : 'block'}).animate({'opacity' : '1'}, 600);
		};

		function hideMainContent() {
			$('.mainContentInner').animate({'opacity' : '0'}, 300,function() {
				$(this).css({'display' : 'none','opacity' : '0'});
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

/*		$scope.openComment = function(id) {
			if( id == "null") {
				return;
			}
			var element = $('#' + event.currentTarget.id)[0];
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
		};*/