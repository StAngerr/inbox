inbox.controller('TasksFilterCtrl', function() {
	this.active = 1;

	this.setActive = function(value) {
		this.active = value;
	};

	this.isSelected = function(value) {
		return this.active == value;
	};
});