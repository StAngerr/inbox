(function() {
	var app=angular.module('tastks-filter',[]);
/*DIRS*/
	app.directive('tasksList',['$compile','localStorageService', function($compile, localStorageService) {

        var link = function(scope, element, attr) {
        	element.on('click', function(event) {
        		event.preventDefault();
        		var elem = event.target;
        		var userId = $(elem).attr('user');
        		scope.userTasks = [];

        		if ( $(elem).hasClass('taskAuthorIcon') ) {
        			$('.filterWrap > task-filter').remove();
        			$('.filterWrap > tasks-list').remove();

        			scope.currentUser = findUser();

        			addUserOverviewHeader();

        			findAssignedTasks();

        			addUserOverviewTasks();
        		}

        		function findAssignedTasks() {
        			var tasks = localStorageService.get('tasks');
        			
   					for (var i=0; i < tasks.length; i++) {
   						if(tasks[i].userId == userId) scope.userTasks.push(tasks[i]);
   					}
        		}

        		function addUserOverviewTasks() {
        			angular.element(document.getElementById('tasksFilter'))
						.append($compile("<cur-user-tasks></cur-user-tasks>")(scope));

        		}

        		function addUserOverviewHeader() {
        			angular.element(document.getElementById('tasksFilter'))
						.prepend($compile("<user-overview></user-overview>")(scope));
        		}

        		function findUser() {
					
        			var users = localStorageService.get('users');

        			for (var i=0; i < users.length; i++ ) {
        				if (users[i].id == userId) return users[i];
        			}	
        		}

        	});
        };

        return {
            restrict: 'E',
            templateUrl: 'src/js/templates/tasksTempl.html',
			link : link
        }
    }]);

	app.directive('curUserTasks', function() {
		return {
			strict : 'E',
			templateUrl : 'src/js/templates/singleUserTasks.html'
		}
	});

	app.directive('taskFilter', function() {
		return {
			strict : 'E',
			templateUrl : 'src/js/templates/taskFilterTempl.html'
		}
	});

	app.directive('userOverview', function() {
		return {
			strict : 'E',
			templateUrl : 'src/js/templates/singleUserOverview.html'
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

	app.controller('TasksFilterCtrl',['$scope','$http','$routeParams','$location','$rootScope','localStorageService',  function($scope, $http, $routeParams, $location, $rootScope, localStorageService) {
		$scope.curStatus = 'your';
		$scope.active = 1;
		
		$scope.yoursTasks = 0;
		$scope.unassignedTasks = 0;

		$scope.tasks = [];

		$scope.activeTasks = {};	

		$scope.urlState = "1";
		$scope.urlTask = "none";	

		$scope.tasks = [];

		$scope.addLogo = function() {
			$('#mainContent').css({
				'opacity' : '0',
				'background' : '#fff url("src/images/inboxLogo1.png") no-repeat 50% 50%',
			}).animate({'opacity' : '1'},  1500);
		};

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

		function initTasks() {	

			if( localStorageService.get('tasks') ) {
				$scope.tasks = localStorageService.get('tasks');
				setUsersToTasks();
				initCategories();
			} else {
				getTasksFromServ();
			}	
		};

		function getTasksFromServ() {
			$http.get('src/content/tasks.json').success(function(data, status, headers, config) {
				$scope.tasks = data;

				setUsersToTasks();
				initCategories();

				localStorageService.set('tasks', $scope.tasks);
			});
		};

		function initCategories() {
			for (var i=0; i < $scope.tasks.length; i++) {
					var id ="" + $scope.tasks[i].id;
					$scope.activeTasks[id] = true;

					if($scope.tasks[i].status === 'your') {
						$scope.yoursTasks++;
					} else if($scope.tasks[i].status === 'unassigned') {
						$scope.unassignedTasks++;
					}
			}
			$scope.allTasks = $scope.unassignedTasks + $scope.yoursTasks;
		};

		function setUsersToTasks() {

			if(localStorageService.get('users')) {
				var users = localStorageService.get('users');
					
				for (var i=0; i < $scope.tasks.length; i++ ) {
					$scope.tasks[i].user = findUser(users, $scope.tasks[i].userId);
				}

			} else {

				$http.get('src/content/users.json').success(function(data, status, headers, config) { 
					var users = data;
					
					for (var i=0; i < $scope.tasks.length; i++ ) {
						$scope.tasks[i].user = findUser(users, $scope.tasks[i].userId);
					}
				});

			}
		};

		function findUser(users,id) {
			for( var i=0; i < users.length; i++) {
				if(users[i].id == id) {
					return users[i];
				}
			}
		}

/*onload actions : tasks list initialization, logo.*/
		(function() {
			initTasks();

			$scope.addLogo();

		})();		
/*_______________*/

	}]);

	app.controller('subCtrl',['$scope','$http','$routeParams','$location','$rootScope','localStorageService', function($scope, $http, $routeParams, $location, $rootScope,localStorageService) {
		$scope.$parent.urlState = $routeParams.state;
		$scope.$parent.urlTask = $routeParams.id;
		var url = $location.path().split("/");

		if(url.length > 3) {
			$scope.setActive(url[2]);
			
			openTask(url[4]);
		};

		$scope.changeUrlState = function(value) {
			$scope.urlTask = "none";
			for (var id in $scope.activeTasks) {
				$scope.activeTasks[id] = true;
			}	
			
			$scope.urlState = value;
			$location.path('/state/' + $scope.urlState + '/task/' + $scope.urlTask);
		};

		$scope.cangeUrlTaskId = function(event) {
			if(event.currentTarget.id == $scope.urlTask) {
				$scope.urlTask = "none";
			} else {
				$scope.urlTask = event.currentTarget.id;
			}
			$location.path('/state/' + ($scope.urlState || "1") + '/task/' + $scope.urlTask);
		};

		function openTask(id) {
			var curElemID =  id;
			
			if(curElemID == 'none') {
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

			closeEditWindow();

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
			if( localStorageService.get('comments' + $scope.$parent.obj.id) && localStorageService.get('users') ) {
				var comments = localStorageService.get('comments' + $scope.$parent.obj.id);
				var users = localStorageService.get('users');

				setAuthorsToComments(comments,users);
			} else {

				$http.get($scope.$parent.obj.comments).success(function(data, status, headers, config) {
				     	var comments = data;
				     	var str = 'comments' + $scope.$parent.obj.id;
				     	
				     	localStorageService.set('comments' + $scope.$parent.obj.id, comments);

				     	$http.get('src/content/users.json').success(function(data, status, headers, config) { 
				     		var users = data;
				     		setAuthorsToComments(comments,users);

				     		localStorageService.set('users',users);
				     	});
				});
			}
		};

		function setAuthorsToComments(comments,users) {
     		for ( var i=0; i < comments.length; i++ ) {
				for (var j=0; j < users.length; j++) {
					if( users[j].id == comments[i].userId) {
						comments[i].authorIcon = users[j].avatar;
					}
				}
			}
			$scope.$parent.$parent.commentsToTask = comments;
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

		function closeEditWindow() {
			if( $('.mainContentInner > .window').css('display') == 'block' ) {
				$('.users').remove();
				$('.mainContentInner > .window').css({'display' : 'none'});
			}

		};

	}]);

	
})();
