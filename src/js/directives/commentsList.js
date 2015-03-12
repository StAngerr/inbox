(function() {
	var app=angular.module('comments-list',[]);

	app.directive('commentsList', function() {
		return {
			strict : 'E',
			templateUrl : 'dist/templates/commentsTmpl.html'
		}
	});

	app.directive('editWindow', function() {
		return {
			strict : 'E',
			templateUrl : 'dist/templates/editPopup.html',
			controller : 'ExpandedTaskCtrl'
		}
	});

	app.directive('users', function() {
		return {
			strict : 'E',
			templateUrl : 'dist/templates/usersTemplate.html',
			controller : 'ExpandedTaskCtrl'
		}

	});
	
	app.controller('ExpandedTaskCtrl',['$scope','$location','$http','localStorageService','$compile', function($scope,$location,$http,localStorageService,$compile) {

		$scope.users;

		$scope.returnBtn = function() {
			var taskUrl = $location.path().split("/");

			taskUrl[4]='undefined';

			$location.path(taskUrl.join("/"));

			$('*').removeClass('slideLeft');
			$('#navigation').addClass('slideRight');
			$('#mainContent').addClass('slideRight');
			$('.taskItem').addClass('activeTask');
		};

		$scope.writeCommentInput = function() {
			if( $('.newComment').hasClass('newCommentExpanded') ) {
				$('.newComment').removeClass('newCommentExpanded');
			} else {
				$('.newComment').addClass('newCommentExpanded');
				$('.newCommentExpanded *').animate({'opacity' : '1'}, 200);
			}
		};

		$scope.addComment = function(comment) {
			var newComment = {
				authorIcon : '',
				author : 'dragon ',
				content : comment.value
			};
			var time = new Date();



			newComment.authorIcon = $('.newCommentExpanded figure .authorIcon').attr('src');
			newComment.author += time.getHours() + ':' + time.getMinutes();
			
			$('.newCommentExpanded .commentInput').val('');
			
			$scope.$parent.commentsToTask.push(newComment);

			localStorageService.set('comments' + $scope.$parent.obj.id + '', $scope.$parent.commentsToTask);

			$('.newComment').removeClass('newCommentExpanded');
		};

		$scope.dropDownShowHide = function() {
			if( $('.dropDownMenu').css('display') == 'none' ) {
				$('.dropDownMenu').show(200);
			} else {
				$('.dropDownMenu').hide(300);
			}
		};

		$scope.addEvents = function(event) {
			$scope.showEditWindow();
		}

		$scope.editButtonsEvents = function() {
			if( $(event.target).hasClass('reassign') ) {
				if($('.users').css('display') == 'block') {
					$('.users').remove();
				} else {
					showUsers();
				}
			}
		};

		function showUsers() {

			if($('.users').css('display') == 'block' ) {
				return;
			}

			if( localStorageService.get('users') ) {
				$scope.users = localStorageService.get('users');
					
				paintUsers($scope.users);
				
				$('.users').toggle( "bounce", { times: 3 }, "slow"); 
				
			} else {
				$http.get('src/content/users.json').success(function(data, status, headers, config) { 
					$scope.users = data;

					paintUsers($scope.users);
					
					$('.users').toggle( "bounce", { times: 3 }, "slow" );
				});	
			}
		}

		function paintUsers(users) {
			angular.element(document.getElementById('editWindow'))
					.append($compile("<users></users>")($scope));
	
		}

		$scope.closeEditWindow = function() {
			$('.users').remove();
			$('.editWindow').remove();
		};

		$scope.reassignTask =function(event) {
			var  check = confirm("You sure you want to reassign this task to " + $(event.currentTarget).attr('name'));

			if(!check) {
				return;
			}

			var currentUserId = event.currentTarget.id; 
			var users = localStorageService.get('users');
			
			for (var i=0; i < users.length; i++) {
				if( users[i].id == currentUserId) $scope.$parent.obj.user = users[i];	
			}

			writeReasingInStorage();
		};

		$scope.openWindow = function(event) {
			if(event.target.name == 'edit') {
				angular.element(document.getElementById('mainContentInner'))
					.append($compile("<edit-window></edit-window>")($scope));
			}
		}

		function writeReasingInStorage() {
			var tasks = localStorageService.get('tasks');
			var temp = $scope.$parent.obj;

			for (var i = 0; i < tasks.length; i++) {
				if(tasks[i].id == temp.id) {
					tasks[i].userId =temp.user.id;
				}
			}
			localStorageService.set('tasks',tasks);
		};

	}]);
})();