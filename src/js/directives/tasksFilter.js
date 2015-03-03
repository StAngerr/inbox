(function() {

	var app=angular.module('tastks-filter',[]);

	app.directive('tasksList', function() {
        var directive = {
            restrict: 'E',
            templateUrl: 'src/js/templates/tasksTempl.html'
        };
        return directive;
    });

	app.directive('taskFilter', function() {
		return {
			strict : 'E',
			templateUrl : 'src/js/templates/taskFilterTempl.html'
		}
	});

	app.controller('TasksFilterCtrl',['$rootScope', '$scope','$http','$filter', function($rootScope, $scope, $http,$filter) {
		$scope.curStatus = 'your';
		$scope.active = 1;
		
		$scope.yoursTasks = 0;
		$scope.unassignedTasks = 0;

		$scope.tasks = [];
		$scope.filteredTasks =  [];

		$http.get('src/content/tasks.json').success(function(data, status, headers, config) {
			$scope.tasks = data;

			for (var i=0; i < data.length; i++) {
				if(data[i].status === 'your') {
					$scope.yoursTasks++;
				} else if(data[i].status === 'unassigned') {
					$scope.unassignedTasks++;
				}
			}

			$scope.allTasks = $scope.unassignedTasks + $scope.yoursTasks;
		});

		$scope.setActive = function(value) {
			var openedElem;
			$('.taskItem').addClass('activeTask');
			if(value === 1) {
				$scope.curStatus = 'your';
			} else if(value === 2) {
				$scope.curStatus = 'unassigned';
			} else {
				$scope.curStatus = '';
			}

			$scope.active = value;
		};

		$scope.isSelected = function(value) {
			return $scope.active == value;
		};

		$scope.openComment = function(event) {
			var element =  event.currentTarget;
			
			if ($('.taskItem.activeTask').length == $('.taskItem').length) {
				$('.taskItem').removeClass('activeTask');
				$(element).addClass('activeTask');
			} else if ($(element).hasClass('activeTask')) {
				$('.taskItem').addClass('activeTask');
			} else {
				$('.taskItem').removeClass('activeTask');
				$(element).addClass('activeTask');
			}

			if( $(window).width() < 620) {
				$('*').removeClass('slideRight');
				$('#navigation').addClass('slideLeft');
				$('#mainContent').addClass('slideLeft');
			}

		};

	}]);
	
})();