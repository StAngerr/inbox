(function() {
	var app=angular.module('comments-list',[]);

	app.directive('commentsList', function() {
		return {
			strict : 'E',
			templateUrl : 'src/js/templates/commentsTmpl.html'
		}
	});
	
	app.controller('ExpandedTaskCtrl',['$scope','$location', function($scope,$location) {

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
		}

		/*$scope.showEditWindow = function() {
			$('.mainContentInner').append('<div class="editWindow">\
				<h1> Edit </h1>\
					<button class="windowBtn reassign" ng-click="editButtonsEvents()">Reassign</button>\
					<button class="windowBtn" click="editButtonsEvents($event)">Button2</button>\
					<button class="windowBtn" ng-click="editButtonsEvents($event)">Button3</button>\
				</div>');

		}
*/
		$scope.addEvents = function(event) {
			$scope.showEditWindow();
		}

		 $scope.editButtonsEvents = function() {
			if( $(event.target).hasClass('reassign') ) {
				alert('ok');
			}

		}	
/*
		$scope.showEditWindow();*/
	}]);


})();