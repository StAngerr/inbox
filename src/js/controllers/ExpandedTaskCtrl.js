inbox.controller('ExpandedTaskCtrl', function($scope) {
	$scope.returnBtn = function() {
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

	$scope.addComment = function() {
		var newComment = {
			authorIcon : '',
			author : 'dragon ',
			content : ''
		};
		var time = new Date();

		newComment.authorIcon = $('.newCommentExpanded figure .authorIcon').attr('src');
		newComment.content = $('.newCommentExpanded .commentInput').val();
		newComment.author += time.getHours() + ':';
		newComment.author += time.getMinutes();
		$scope.$parent.commentsToTask.push(newComment);

		$('.newComment').removeClass('newCommentExpanded');
	};
});