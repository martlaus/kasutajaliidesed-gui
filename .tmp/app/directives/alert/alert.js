define([
    'angularAMD',
    'services/translationService',
    'services/alertService',
    'services/toastService',
], function(angularAMD) {
	angularAMD.directive('dopAlert', ['translationService', '$rootScope', 'alertService', 'toastService', function(translationService, $rootScope, alertService, toastService) {
        return {
            scope: true,
            controller: ["$scope", "$timeout", function($scope, $timeout) {
                $scope.$watch(function() {
                        return alertService.getAlert();
                    },
                    function(newValue) {
                        if (newValue.message) {
                        	toastService.show(newValue.message);
                            alertService.clearMessage();

                            $timeout(function() {
                                $scope.alert = null;
                            }, 5000);
                        }
                    }, true
                );
            }]
        };
    }]);
});