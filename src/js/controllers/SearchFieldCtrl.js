inbox.controller('SearchFieldCtrl', function() {
	this.searchAnimationEvent = function() {
		$('#searchField').css({'display' : 'block'}).focus();
		
		$('#searchField').blur(function() {
		 	$(this).css({'display' : 'none'});
		});
	};
});