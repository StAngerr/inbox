(function() {
	var app=angular.module('comments-list',[]);

	app.directive('commentsList', function() {
		return {
			strict : 'E',
			templateUrl : 'src/js/templates/commentsTmpl.html'
		}
	});

	app.directive('users', function() {
		return {
			strict : 'E',
			templateUrl : 'src/js/templates/usersTemplate.html',
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
				$('.newCommentExpanded *').animate({'opacity' : '1'},200);
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
				//$('.editWindow').append('<div class="users"><h2>Reassign to: </h2></div>');
				showUsers();
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
					
					/*$('.users').toggle( "boun ce", { times: 3 }, "slow" );*/
					
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
			$('.editWindow').css({'display' : 'none'});
		};

		$scope.reassignTask =function(event) {
			alert('asdas');
			var currentUserId = event.currentTarget.id; 
			var users = localStorageService.get('users');


		};

		$scope.openEdit = function() {
			$('.editWindow').css({'display' : 'block'});
		};
	}]);
})();