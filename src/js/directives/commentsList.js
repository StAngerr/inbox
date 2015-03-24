(function() {
	var app=angular.module('comments-list',[]);

	app.directive('commentsList', function() {
		return {
			strict : 'E',
			templateUrl : 'src/js/templates/commentsTmpl.html'
		}
	});

	app.directive('editWindow', function() {
		return {
			strict : 'E',
			templateUrl : 'src/js/templates/editPopup.html',
			controller : 'ExpandedTaskCtrl'
		}
	});

	app.directive('reassignSection', function() {
		function link(scope, element, attrs) {
				setTimeout(function(){ $('#reassignSection').addClass('slideMore'); }, 25);				
		 }
		return {
			strict : 'E',
			templateUrl : 'src/js/templates/reassignTmpl.html',
			controller : 'ExpandedTaskCtrl',
			link : link
		}
	});

	app.directive('users', function() {
		return {
			strict : 'E',
			templateUrl : 'src/js/templates/usersTemplate.html',
			controller : 'ExpandedTaskCtrl'
		}
	});
	
	app.controller('ExpandedTaskCtrl',['$scope','$location','$http','localStorageService','$compile', function($scope, $location, $http, localStorageService, $compile) {
		$scope.users;
/*		localStorageService.clearAll();*/
		var mapParams = {
			coordinates : {},
			options : {
				zoom : 15,
				center : {},
				mapTypeControl: true,
				navigationControlOptions: {
					style: google.maps.NavigationControlStyle.LARGE
				},
				mapTypeId : google.maps.MapTypeId.ROADMAP
			}
		};
		var map = {}; 
		var marker;
		var tempForMarker = {};

/*_____________________________________________________________________________*/
		$scope.openLocation = function(event) {
			if(event.target.id !== 'locationBlock') return;
			if( document.getElementById('map') ){
				$('#locationBlock').removeClass('closeArrow');
				$('#map').remove();
				return;
			}
			initMapParams();
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(success);
			} else {
				error('Geo Location is not supported');
			}
			$('#locationBlock').prepend('<figure id="map"></figure>');
			$('#locationBlock').addClass('closeArrow');

			function success(position) {
				map = new google.maps.Map($('#map')[0], mapParams.options);
				if( !marker) {
					 marker = new google.maps.Marker({
						position: mapParams.coordinates,
						map: map,
						title:"Delivery point!"
					});
				}				/*0.003*/
				map.setCenter(new google.maps.LatLng((mapParams.coordinates.k + 0.003), mapParams.coordinates.D));
				var infowindow = new google.maps.InfoWindow({
		        	content: 'Location info:<br/>Country Name:<br/>LatLng:'
		    	});
				marker.setMap(map);
				$('#map').animate({opacity: '1', height: '300px'}, 500, function() {
					google.maps.event.trigger(map,'resize');
				});
			}
		}

		$scope.editLocation = function() {
			$('#locationBlock').prepend('<figure id="map"></figure>');

			$('.locationEditBtn').show("fast");
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(success);
			} else {
				error('Geo Location is not supported');
			}
			initMapParams();

			function success(position) {
				map = new google.maps.Map($('#map')[0], mapParams.options);
				if( !marker) {
					 marker = new google.maps.Marker({
						position: mapParams.coordinates,
						map: map,
						title:"Delivery point!"
					});
				}

				var infowindow = new google.maps.InfoWindow({
		        	content: 'Location info:<br/>Country Name:<br/>LatLng:'
		    	});
		    	
		    	google.maps.event.addListener(map, 'click', function (event) {
		    		var av = event.latLng;
		    		marker.setMap(null);
		    		marker = new google.maps.Marker({
						position: av,
						map: map,
						title:"Delivery point!"
					});
		    			marker.setMap(map);
		    	});

		    	google.maps.event.addListener(marker, 'click', function () {

		        	infowindow.open(map, marker);
		    	});
		    	marker.setMap(map);
				$('#map').animate({opacity: '1', height: '300px'}, 500, function() {
					google.maps.event.trigger(map,'resize');
				});
			}
		}

		$scope.replaceMarker = function() {
			$scope.$parent.obj.location.latitude = marker.position.k;
			$scope.$parent.obj.location.longitude = marker.position.D;
			writeInLocalStorage();
		}

		function writeInLocalStorage() {
			var tasks = localStorageService.get('tasks');
			for (var i = 0; i < tasks.length; i++) {
				if(tasks[i].id == $scope.$parent.obj.id) {
					tasks[i] = $scope.$parent.obj; 
					localStorageService.set('tasks',tasks);
					break;
				}
			}			
		}
		$scope.hideMap = function() {
			$('#locationBlock').removeClass('closeArrow');
			$('#map').remove();			
			$('.locationEditBtn').hide();
			$('#locationBlock').animate({'height' : '0'}, 250);
		}

		function initMapParams() {
			mapParams.coordinates = new google.maps.LatLng($scope.$parent.obj.location.latitude, $scope.$parent.obj.location.longitude);
			mapParams.options.center = mapParams.coordinates;
		}
/*_____________________________________________________________________________*/
		$scope.returnBtnHead = function() {
			var taskUrl = $location.path().split("/");

			taskUrl[4]='none';

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

		$scope.closeReassign = function() {
			$('#reassignSection').removeClass('slideMore');
 			
 			$('#navigation').removeClass('slideMore');
			$('#mainContent').removeClass('slideMore');
			setTimeout(function(){
			   $("reassign-section").remove();
			}, 600);
 		}

		$scope.menuBtnEvents = function(event) {
			var button = event.target;

			if(button.name == 'reassign') {
				initUsers();

				$('#navigation').addClass('slideMore');
				$('#mainContent').addClass('slideMore');

				addReassignSection();
			} else if(button.name == 'changeLocation') {
				$scope.editLocation();
			}
		}

		function initUsers() {
			if( localStorageService.get('users') ) {
				$scope.users = localStorageService.get('users');
			} else {
				$http.get('src/content/users.json').success(function(data, status, headers, config) { 
					$scope.users = data;					
				});	
			}
		}

		function addReassignSection() {
			angular.element(document.getElementById('mainWrapper'))
					.append($compile("<reassign-section></reassign-section>")($scope));
		}

		$scope.reassignTask = function(event) {
			var  check = confirm("You sure you want to reassign this task to " + $(event.currentTarget).attr('name'));

			if(!check) {
				return;
			}

			$scope.closeReassign();
			
			var currentUserId = event.currentTarget.id; 
			var users = localStorageService.get('users');
			
			for (var i=0; i < users.length; i++) {
				if( users[i].id == currentUserId) $scope.$parent.obj.user = users[i];	
			}

			writeReasingInStorage();
		};

		function writeReasingInStorage() {
			var tasks = localStorageService.get('tasks');
			var temp = $scope.$parent.obj;

			for (var i = 0; i < tasks.length; i++) {
				if(tasks[i].id == temp.id) {
					tasks[i].userId = temp.user.id;
				}
			}
			localStorageService.set('tasks',tasks);
		};

		$scope.openWindow = function(event) {
			if(event.target.name == 'edit') {
				angular.element(document.getElementById('mainContentInner'))
					.append($compile("<edit-window></edit-window>")($scope));
			}
		}

		$scope.closeEditWindow = function() {
			$('.users').remove();
			$('.editWindow').remove();
		};

		/*Events for avatar icons in main content block*/
	 	$scope.zoomAvatarExpTask = function(event) {
	 		$(event.target).addClass('XD');

	 		$(event.target).on('mouseleave', function() {
	 			$(this).removeClass('XD');
	 		});
	 	}

	 	$scope.openUserExpTask = function(id) {
			$('*').removeClass('slideLeft');
			$('#navigation').addClass('slideRight');
			$('#mainContent').addClass('slideRight');
			$('.taskItem').addClass('activeTask');
			$location.path('user/'+ id +'/task/none');
	 	}
  
	}]);
})();