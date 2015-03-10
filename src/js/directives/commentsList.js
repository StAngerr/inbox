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
			if( localStorageService.get('users') ) {
				var users = localStorageService.get('users');

					paintUsers(users);
					//$('.users').append(paintUsers(users));
					$('.users').toggle( "bounce", { times: 3 }, "slow" );

			} else {
				$http.get('src/content/users.json').success(function(data, status, headers, config) { 
					var users = data;

					paintUsers(users);
					//$('.users').append(paintUsers(users));
					$('.users').toggle( "bounce", { times: 3 }, "slow" );
				});	
			}
		}

		function paintUsers(users) {
			var temp = '';
			var $el;

		/*	for (var i=0; i < users.length; i++) {
				temp += '<div name="' + users[i].id + '" class="singleUser" ng-click="reassignTask($event)">' +
					'<figure class="singleUserAvatar">' +
					'<img src="' + users[i].avatar + '">' +
					'</figure>' +
					'<p class="singleUserName">' +  users[i].name +'</p>'+
				'</div>';
			}*/

			$el = temp;
			
			$($el).appendTo('.users');
			$compile($el)($scope);
			$scope.$apply();
			
		}

		$scope.closeEditWindow = function() {
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