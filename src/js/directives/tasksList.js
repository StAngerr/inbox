(function() {
    var app = angular.module('tasks-list',[]);
    app.directive('tasksList', tasksList);

    function tasksList() {
        var directive = {
            restrict: 'E',
            templateUrl: 'src/js/templates/tasksTempl.html',
           /* controller: 'TasksFilterCtrl',*/
/*            scope1: {
                tasks: '='
            }*/
        };
        return directive;
    }

})();