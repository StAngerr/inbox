$(window).resize(function() {
	if($( window ).width() > 620) {
		$('*').removeClass('slideLeft');
	}
});

$(document).on('click', function(event) {
	if( $(event.target).hasClass('taskMenu') || $(event.target.offsetParent).hasClass('taskMenu')) {

	}else {
		if($('.dropDownMenu').is(':visible')) $('.dropDownMenu').hide(300);
	}
});

