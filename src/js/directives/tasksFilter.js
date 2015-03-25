(function() {
	var app=angular.module('tastks-filter',[]);
/*DIRS*/
	app.directive('tasksList',['$compile','$routeParams','$location', function($compile, $routeParams, $location) {
        var link = function(scope, element, attr) {
        	var ssss = scope.tasks;
	        	element.on('click', function(event) {
	        		var task;
	        		var elem = event.target;
	        		var userId = $(elem).attr('user');
	        		var url = $location.path().split("/");
	        		/*Check if event didn't fired on user*/
		      		if ( $(elem).hasClass('taskAuthorIcon') ) {
		      				scope.changeFilterTo('user',userId);
							addReturnButton();
							$location.path('user/' + userId + '/' + (url[3] || 'task') + '/'  + (url[4] || 'none'));
							scope.$apply();
							return;
		        	}	        	
					/*Detect clicked <li> element*/
		        	if( $(event.target).hasClass('taskItem') ) {
		        		task = event.target;
		        	} else {
		        		task = $(event.target).closest('.taskItem')[0];
		        	}
		       		/* Change url */
					if (url.length < 3) {
						$location.path('/state/1/task/' + task.id);
					} else if(task.id == url[4]) {
						$location.path(url[1] + '/' + url[2] + '/task/' + 'none');
					} else {
						$location.path(url[1] + '/' + url[2] + '/task/' + task.id);
					}
					scope.$apply();
        	});
        	/*button*/
        	function addReturnButton() {
				angular.element(document.getElementById('navHeader'))
						.append($compile('<button ng-click="actorViewReturnBtn()" class="returnBtn" > </button>')(scope.$parent));
	        	}
            };
        return {
            restrict: 'E',
            templateUrl: 'src/js/templates/tasksTempl.html',
			link : link,
			controller : 'subCtrl'
        }
    }]);

	app.directive('taskFilter',['$location', function($location) {
		var link = function(scope, element, attr) {	
			element.on('click', function(event) {
				var url = $location.path().split("/");
				var target = $(event.target).closest('.categories')[0];
				/*reset all tasks to default */
				for (var id in scope.$parent.activeTasks) {
					scope.$parent.activeTasks[id] = true;
				}

				$location.path('/state/' + ($(".taskFilter > div").index(target) + 1) + '/task/none');
				scope.$apply();
			});

			$('.taskFilter').css({
				'position' : 'relative',
				'left' : '100%'
			});

			$('.taskFilter').animate({'left' : '0'}, 300);
        };
		return {
			strict : 'E',
			templateUrl : 'src/js/templates/taskFilterTempl.html',
			link : link
		}
	}]);

	app.directive('userOverview', function() {
		var link = function(scope, element, attr) {	
			$('.userOverviewHeader').css({
				'position' : 'relative',
				'left' : '-100%'
			});

			$('.userOverviewHeader').animate({'left' : '0'},300);
		};
		return {
			strict : 'E',
			templateUrl : 'src/js/templates/singleUserOverview.html',
			link : link
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

	app.controller('TasksFilterCtrl',['$scope','$http','$routeParams','$location','$rootScope','localStorageService','$compile',  function($scope, $http, $routeParams, $location, $rootScope, localStorageService,$compile) {
		$scope.active = 1;
		
		$scope.yoursTasks = 0;
		$scope.unassignedTasks = 0;

		$scope.tasks = [];

		$scope.activeTasks = {};	

    	$scope.filterParams = {status : 'your', userId : ''};
    	/*Change filter between filtering by user assigned tasks and filtering by category*/
	    $scope.changeFilterTo = function(type, value) {
	       if (type === 'status' ) {
	       		$scope.filterParams.status = value;
	       		$scope.filterParams.userId = '';
	       } else if(type === 'user') {
	       		$scope.filterParams.userId = value;
	       		$scope.filterParams.status = '' 	
	       }
	    };

		$scope.addLogo = function() {
			$('#mainContent').css({
				'opacity' : '0',
				'background' : '#fff url("src/images/inboxLogo1.png") no-repeat 50% 50%',
			}).animate({'opacity' : '1'},  1500);
		};

		$scope.setActive = function(value) {
			checkStateBlockExistence();

			var openedElem;

			if(value == "null") {
				return;
			}
			if(value == 1) {
				$scope.changeFilterTo('status','your');				
			} else if(value == 2) {
				$scope.changeFilterTo('status','unassigned');				
			} else {
				$scope.changeFilterTo('status','');
			}
			$scope.active = value;		
		};

		$scope.isSelected = function(value) {
			return $scope.active == value;
		};	

		function checkStateBlockExistence() {
			if( !( $('.filterWrap > task-filter').length ) ) {
				$('.filterWrap > cur-user-tasks').remove();
				$('.filterWrap > user-overview').remove();
				addUserTasksFilter();
			}
		};

		function addUserTasksFilter() {
			angular.element(document.getElementById('tasksFilter'))
				.prepend($compile("<task-filter></task-filter>")($scope));
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
		};
/*onload actions : tasks list initialization, logo.*/
		(function() {
			initTasks();
			$scope.addLogo();
		})();
	}]);

	app.controller('subCtrl',['$scope','$http','$routeParams','$location','$rootScope','localStorageService','$compile', function($scope, $http, $routeParams, $location, $rootScope, localStorageService, $compile) {
		var state = $routeParams.state;
		var taskID = $routeParams.id;
		var user = $routeParams.userID;
		/*Router direction controller*/
		if(user) {
			openUser(user);
			openTask(taskID);
		} else if(state){
			$scope.setActive(state);
			openTask(taskID);
		}

		function openUser(userID) {
			var lem = $('.userOverviewHeader')[0];

			if( ($('.filterWrap > user-overview').length)  && ($(lem).attr('userid') == userID) ) {
				return;
			}
			$scope.currentUser = {};
			$scope.assignedTasksCount = 0;
			/*For refresh only when filterParams are default*/
			$scope.filterParams.userId = userID;
			$scope.filterParams.status = ''; 
			/* RETURN BUTTON  */
			if( !($('.navHeader > .returnBtn').length) ) {
				angular.element(document.getElementById('navHeader'))
						.append($compile('<button ng-click="actorViewReturnBtn()" class="returnBtn" > </button>')($scope.$parent));
			}
			refreshTaskList();		
			//$scope.$parent.currentUser = findUser(userID);
			$scope.$parent.currentUser = findUser(userID);
			initAssignedTaskCount(userID);
			/* CLEAR ALL SECTIONS*/
			$('.filterWrap > task-filter').remove();
			$('.filterWrap > user-overview').remove();
			addUserOverviewHeader();
		};
/*refresh tasks if some tasks were reassigned (!!!!!!!!!!!!!!!!!!!!!!!!!!!!!)*/
		function refreshTaskList() {
			var temp = localStorageService.get('tasks');

			for (var i=0; i < $scope.tasks.length; i++) {
				$scope.tasks[i].userId = temp[i].userId;
			}	
		}
/* Just counts how many tasksare assigned to  user*/
		function initAssignedTaskCount(userId) {
			var tasks = localStorageService.get('tasks');

			$scope.$parent.assignedTasksCount = 0;
			for (var i=0; i < tasks.length; i++) {
					if(tasks[i].userId == userId) $scope.$parent.assignedTasksCount++;
			}
		};
/*   APPENDs  USER VIEW HEAD*/
		function addUserOverviewHeader() {
			angular.element(document.getElementById('tasksFilter'))
				.prepend($compile("<user-overview></user-overview>")($scope.$parent));
		};

		function findUser(userId) {
			var users = localStorageService.get('users');

			for (var i=0; i < users.length; i++ ) {
				if (users[i].id == userId) return users[i];
			}	
		}; 

		function openTask(id) {
			checkTasksBlockExistence();
			var curElemID =  id;
			refreshTaskList();
			closeMap();
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
		};

		function checkTasksBlockExistence() {
			if( !($('.filterWrap > tasks-list').length) && !($('.filterWrap > cur-user-tasks').length)) {
				addTasksBlock();
			}
		};

		function addTasksBlock() {
			angular.element(document.getElementById('tasksFilter'))
				.append($compile("<tasks-list></tasks-list>")($scope.$parent));

		};

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
		function closeMap() {
			$('#locationBlock > figure').remove();
			$('#locationBlock').removeClass('closeArrow');
			$('.locationEditBtn').hide();
		}

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
