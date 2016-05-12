define([
    'angularAMD',
    'services/serverCallService',
    'services/searchService',
    'directives/learningObjectRow/learningObjectRow'
], function(angularAMD) {
    angularAMD.directive('dopSidebar', ['serverCallService', '$location', 'searchService', function() {
        return {
            scope: true,
            templateUrl: 'directives/sidebar/sidebar.html',
            controller: function($scope, serverCallService, $location, searchService) {

                var SIDE_ITEMS_AMOUNT = 5;


            }
        }
    }]);
});
