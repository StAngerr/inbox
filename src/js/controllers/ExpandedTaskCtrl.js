inbox.controller('ExpandedTaskCtrl', function($scope) {
	$scope.returnBtn = function() {
		$('*').removeClass('slideLeft');
		$('#navigation').addClass('slideRight');
		$('#mainContent').addClass('slideRight');
		$('.taskItem').addClass('activeTask');
	};
});